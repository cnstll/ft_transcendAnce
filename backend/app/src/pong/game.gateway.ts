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
    this.server.to(createMessageDto.room).emit('message', message);
    // this.server.to('thisisnotaroomandshouldnotwor').emit('message', message);
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
    return this.messagesService.identify(name, client.id);
  }

}
