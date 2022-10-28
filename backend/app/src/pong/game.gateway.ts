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
import { SchedulerRegistry } from '@nestjs/schedule';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth-guard';
import { UseGuards } from '@nestjs/common';
import { Players } from './entities/position.entity';
import { GetCurrentUserId } from 'src/common/decorators/getCurrentUserId.decorator';

@WebSocketGateway({
  cors: {
    // origin: [
    //   'http://localhost',
    //   'http://localhost:8080',
    //   'http://localhost:3000',
    // ],
    origin: 'http://localhost:8080',
    credentials: true,
  },
})
export class GameGateway {
  @WebSocketServer()
  server: Server;

  roomMap = new Map<string, Players>();

  constructor(
    private readonly messagesService: GameService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  @SubscribeMessage('createMessage')
  async create(@MessageBody() createMessageDto: PositionDto) {
    const message = this.messagesService.create(createMessageDto);
    this.server.to(createMessageDto.room).emit('message', message);
    if (message.p2s >= 10 || message.p1s >= 10) {
      this.deleteInterval(createMessageDto.room);
      this.messagesService.deleteGame(createMessageDto.room);
      this.server
        .to(createMessageDto.room)
        .emit('roomJoined', { ready: false });
      this.roomMap.delete(createMessageDto.room);
    }
    return message;
  }

  @SubscribeMessage('createRoom')
  createRoom(
    @MessageBody('name') name: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(name);
    client.to(name).emit('roomCreated', { room: name });
    // this.server.to(name).emit('roomCreated', { room: name });
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

  addInterval(name: string, milliseconds: number) {
    const callback = () => {
      const message = this.messagesService.moveBall(name);
      this.server.emit('message', message);
    };

    const interval = setInterval(callback, milliseconds);
    this.schedulerRegistry.addInterval(name, interval);
  }
  deleteInterval(name: string) {
    this.schedulerRegistry.deleteInterval(name);
  }

  getInterval(name: string) {
    const interval = this.schedulerRegistry.getInterval(name);
    return interval;
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('join')
  joinRoom(
    @MessageBody('name') name: string,
    @ConnectedSocket() client: Socket,
    @GetCurrentUserId() id: string,
  ) {
    if (name == null) {
      if (this.roomMap.size == 0) {
        name = this.messagesService.makeid(5);
      } else {
        for (const [key, value] of this.roomMap) {
          if (value.p2 == null) {
            name = key;
          }
        }
      }
    }
    client.join(name);
    // if (this.players.p1 == null || this.players.p1 == id) {
    this.server.to(name).emit('roomJoined', { ready: false });

    if (this.roomMap.get(name) == null || this.roomMap.get(name)['p1'] == id) {
      const players: Players = {
        p1: null,
        p2: null,
      };
      this.roomMap.set(name, players);
      this.roomMap.get(name)['p1'] = id;
      return { gameId: name, pNumber: 1 };
    } else {
      try {
        this.getInterval(name);
      } catch (e) {
        this.addInterval(name, 10);
      }
      this.roomMap.get(name)['p2'] = id;
      this.messagesService.createGame(name);
      this.server.to(name).emit('roomJoined', { ready: true });
      return { gameId: name, pNumber: 2 };
    }
  }
}
