import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RankingService } from './raking.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth-guard';
import { UseGuards } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:8080',
    credentials: true,
  },
})
export class RankingGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: RankingService) {}

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('joinGame')
  connectToRanking(@ConnectedSocket() clientSocket: Socket) {
    return this.messagesService.list(clientSocket, this.server);
  }
}
