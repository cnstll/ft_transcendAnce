import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PositionDto } from './dto/position.dto';
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

  constructor(private readonly messagesService: GameService) { }

  @SubscribeMessage('updatePaddlePos')
  async create(@MessageBody() createMessageDto: PositionDto) {
    const message = this.messagesService.create(createMessageDto);
    if (message) {
      this.server.to(createMessageDto.room).emit('updatedGameInfo', message);
    }
    return message;
  }

  @SubscribeMessage('disconnect')
  @UseGuards(JwtAuthGuard)
  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.messagesService.pause(this.socketToId.get(client.id), this.server);
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('joinGame')
  joinRoom(
    @MessageBody('name') name: string,
    @MessageBody('mode') mode: GameMode,
    @ConnectedSocket() client: Socket,
    @GetCurrentUserId() id: string,
  ) {
    this.socketToId.set(client.id, id);
    return this.messagesService.join(name, client, id, this.server, mode);
  }
}
