import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UserStatus } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { JwtAuthGuard } from '../auth/guard/jwt.auth-guard';
import { GetCurrentUserId } from '../common/decorators/getCurrentUserId.decorator';
import { UserService } from './user.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:8080',
    credentials: true,
  },
})
@UseGuards(JwtAuthGuard)
export class UserGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly userService: UserService) {}

  @SubscribeMessage('connectUser')
  async userConnect(
    @GetCurrentUserId() userId: string,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    await this.userService.updateConnectionStatus(userId, UserStatus.ONLINE);
    clientSocket.broadcast.emit('userConnected');
  }

  @SubscribeMessage('disconnectUser')
  userDisconnect(@ConnectedSocket() clientSocket: Socket) {
    clientSocket.broadcast.emit('userDisconnected');
  }

  @SubscribeMessage('joinGame')
  async userInGame(
    @ConnectedSocket() clientSocket: Socket,
    @GetCurrentUserId() userId: string,
  ) {
    await this.userService.updateConnectionStatus(userId, UserStatus.PLAYING);
    clientSocket.broadcast.emit('userInGame');
  }

  @SubscribeMessage('leaveGame')
  async gameEnded(
    @ConnectedSocket() clientSocket: Socket,
    @GetCurrentUserId() userId: string,
  ) {
    await this.userService.updateConnectionStatus(userId, UserStatus.ONLINE);
    clientSocket.broadcast.emit('userGameEnded');
  }
}
