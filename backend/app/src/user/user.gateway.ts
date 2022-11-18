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
import { JwtPayload } from '../auth/types';
import { GetCurrentUserId } from '../common/decorators/getCurrentUserId.decorator';
import { SocketToUserIdStorage } from './socketToUserIdStorage.service';
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
  constructor(
    private readonly userService: UserService,
    private readonly socketToIdService: SocketToUserIdStorage,
  ) {}

  @SubscribeMessage('connectUser')
  userConnect(
    @GetCurrentUserId() userId: string,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    this.userService.updateConnectionStatus(userId, UserStatus.ONLINE);
    clientSocket.broadcast.emit('userConnected');
  }

  @SubscribeMessage('disconnectUser')
  userDisconnect(@ConnectedSocket() clientSocket: Socket) {
    clientSocket.broadcast.emit('userDisconnected');
  }

  @SubscribeMessage('joinGame')
  userInGame(
    @ConnectedSocket() clientSocket: Socket,
    @GetCurrentUserId() userId: string,
  ) {
    this.userService.updateConnectionStatus(userId, UserStatus.PLAYING);
    clientSocket.broadcast.emit('userInGame');
  }

  @SubscribeMessage('leaveGame')
  gameEnded(
    @ConnectedSocket() clientSocket: Socket,
    @GetCurrentUserId() userId: string,
  ) {
    this.userService.updateConnectionStatus(userId, UserStatus.ONLINE);
    clientSocket.broadcast.emit('userGameEnded');
  }
  @SubscribeMessage('connect')
  handleConnection(@ConnectedSocket() clientSocket: Socket) {
    if (clientSocket.handshake.headers.cookie) {
      const base64Payload = clientSocket.handshake.headers.cookie.split('.')[1];
      const payloadBuffer = Buffer.from(base64Payload, 'base64');
      const user: JwtPayload = JSON.parse(
        payloadBuffer.toString(),
      ) as JwtPayload;
      this.socketToIdService.set(clientSocket.id, user.id);
      clientSocket.emit('userConnected');
    }
  }

  @SubscribeMessage('disconnect')
  handleDisconnect(@ConnectedSocket() clientSocket: Socket) {
    const userId = this.socketToIdService.get(clientSocket.id);
    this.userService.updateConnectionStatus(userId, UserStatus.OFFLINE);
    this.socketToIdService.delete(clientSocket.id);
    clientSocket.broadcast.emit('userDisconnected');
  }
}
