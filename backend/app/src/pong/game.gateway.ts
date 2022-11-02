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
    origin: [
      'http://localhost',
      'http://localhost:8080',
      'http://localhost:3000',
    ],
    credentials: true,
  },
})
export class GameGateway {
  @WebSocketServer()
  server: Server;
  socketToId = new Map<string, string>();

  constructor(private readonly messagesService: GameService) {}

  @SubscribeMessage('createMessage')
  async create(@MessageBody() createMessageDto: PositionDto) {
    const message = this.messagesService.create(createMessageDto);
    this.server.to(createMessageDto.room).emit('message', message);
    return message;
  }

  @SubscribeMessage('connection')
  test() {
    console.log('hi');
  }

  // Please I need this to figure stuff out later
  @SubscribeMessage('disconnect')
  @UseGuards(JwtAuthGuard)
  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.messagesService.pause(this.socketToId.get(client.id));
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('join')
  joinRoom(
    @MessageBody('name') name: string,
    @ConnectedSocket() client: Socket,
    @GetCurrentUserId() id: string,
  ) {
    this.socketToId.set(client.id, id);
    console.log(id);
    return this.messagesService.join(name, client, id, this.server);
  }
}
