import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GetCurrentUserId } from '../common/decorators/getCurrentUserId.decorator';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:8080',
    credentials: true,
  },
})
export class UserGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('connectUser')
  userConnect(
    @GetCurrentUserId() userId: string,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    this.server.emit('userConnected');
  }

  @SubscribeMessage('disconnectUser')
  userDisconnect() {
    console.log('User is disconnecting');
    this.server.emit('userDisconnected');
  }

  @SubscribeMessage('inGame')
  userInGame() {
    this.server.emit('userInGame');
  }

  @SubscribeMessage('gameEnded')
  gameEnded() {
    this.server.emit('userGameEnded');
  }
}
