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
    @MessageBody() createMessageDto: PositionDto,
    @GetCurrentUserId() id: string,
  ) {
    const message = this.messagesService.create(createMessageDto.y, id);
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
    // @MessageBody('name') name: string,
    @ConnectedSocket() client: Socket,
    @GetCurrentUserId() id: string,
  ) {
    this.socketToId.set(client.id, id);
    return this.messagesService.join(client, id, this.server);
  }
}
