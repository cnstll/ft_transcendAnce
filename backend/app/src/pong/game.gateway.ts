import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth-guard';
import { UseGuards } from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorators/getCurrentUserId.decorator';
import { GameMode } from './entities/game.entities';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:8080',
    credentials: true,
  },
})
export class GameGateway {
  @WebSocketServer()
  server: Server;
  socketToId = new Map<string, string>();

  constructor(private readonly messagesService: GameService) {}

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('updatePaddlePos')
  async create(
    @MessageBody('yPos') yPos: number,
    @GetCurrentUserId() id: string,
  ) {
    const message = this.messagesService.create(yPos, id);
    return message;
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('disconnect')
  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.messagesService.pause(this.socketToId.get(client.id), this.server);
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('leaveGame')
  handleAbandon(@ConnectedSocket() client: Socket) {
    this.messagesService.pause(this.socketToId.get(client.id), this.server);
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('joinGame')
  joinRoom(
    @MessageBody('mode') mode: GameMode,
    @ConnectedSocket() client: Socket,
    @GetCurrentUserId() id: string,
  ) {
    this.socketToId.set(client.id, id);
    return this.messagesService.join(client, id, this.server, mode);
  }
}
