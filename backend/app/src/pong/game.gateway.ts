import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsResponse } from '@nestjs/websockets';
import { PositionDto } from './dto/position.dto';
import { GameService } from './game.service';


@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway {

  @WebSocketServer()
  server: Server;


  constructor(private readonly messagesService: GameService) { }
  @SubscribeMessage('createMessage')
  async create(@MessageBody() createMessageDto: PositionDto) {
    const message = this.messagesService.create(createMessageDto);
    this.server.emit('message', message);
    return message;
  }

  @SubscribeMessage('createRoom')
  createRoom(socket: Socket): WsResponse<unknown> {
    // createRoom(socket: Socket): WsResponse<unknown> {
    socket.join('aRoom');
    socket.to('aRoom').emit('roomCreated', { room: 'aRoom' });
    return { event: 'roomCreated', data: 'aroom' };
  }

  @SubscribeMessage('findAllMessages')
  connect() {
    return this.messagesService.findAll();
  }

  @SubscribeMessage('findAllMessages')
  findAll() {
    return this.messagesService.findAll();
  }

  @SubscribeMessage('findOneMessage')
  findOne(@MessageBody() id: number) {
    return this.messagesService.findOne(id);
  }

  @SubscribeMessage('join')
  joinRoom(@MessageBody('name') name: string, @ConnectedSocket() client: Socket) {
    return this.messagesService.identify(name, client.id);

  }

  @SubscribeMessage('typing')
  async typing(@MessageBody('isTyping') isTyping: Boolean, @ConnectedSocket() client: Socket) {
    const name = await this.messagesService.getClientName(client.id);
    client.broadcast.emit('typing', { name, isTyping });
  }

}
