import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
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
  async create(@MessageBody() createMessageDto: PositionDto, @ConnectedSocket() client: Socket) {
    const message = this.messagesService.create(createMessageDto);
    client.to(createMessageDto.room).emit('message', message);
    // client.emit('message', message);
    // client.broadcast.emit('message', message);
    // this.server.to(createMessageDto.room).emit('message', message);
    // client.to('id').emit('message', client.id);
    return message;
  }

  @SubscribeMessage('createRoom')
  createRoom(@MessageBody('name') name: string, @ConnectedSocket() client: Socket) {
    client.join(name);
    client.to(name).emit('roomCreated', { room: name });
    return { event: 'roomCreated', data: 'atest' };
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
    client.join(name);
    this.server.to(name).emit('roomJoined', name);
    console.log('hiya');
    var clients = this.server.sockets.adapter.rooms.get(name);
    console.log(clients.size);
    return clients.size;
    // return this.messagesService.identify(name, client.id);
  }

}
