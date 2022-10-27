import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PositionDto } from './dto/position.dto';
import { GameService } from './game.service';
import { SchedulerRegistry } from "@nestjs/schedule";
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth-guard';
import { UseGuards } from '@nestjs/common';
// import { GetCurrentUserId } from 'src/common/decorators/getCurrentUserId.decorator';
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

  players: Players = {
    p1: null,
    p2: null,
  };
  // private schedulerRegistry: SchedulerRegistry;
  // job = this.schedulerRegistry.getInterval('start');

  constructor(private readonly messagesService: GameService,
    private schedulerRegistry: SchedulerRegistry
  ) {
  }

  @SubscribeMessage('createMessage')
  async create(@MessageBody() createMessageDto: PositionDto, @ConnectedSocket() client: Socket) {
    const message = this.messagesService.create(createMessageDto);
    this.server.to(createMessageDto.room).emit('message', message);
    if (message.p2s >= 10 || message.p1s >= 10) {
      this.deleteInterval('start');
    }

    return message;
  }

  @SubscribeMessage('createRoom')
  createRoom(@MessageBody('name') name: string, @ConnectedSocket() client: Socket) {
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
      const message = this.messagesService.moveBall();
      this.server.emit('message', message);
    };

    const interval = setInterval(callback, milliseconds);
    this.schedulerRegistry.addInterval(name, interval);
  }
  deleteInterval(name: string) {
    this.schedulerRegistry.deleteInterval(name);
    // this.logger.warn(`Interval ${name} deleted!`);
  }


  getIntervals() {
    const intervals = this.schedulerRegistry.getInterval('start');
    console.log(intervals);
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('join')
  joinRoom(@MessageBody('name') name: string, @ConnectedSocket() client: Socket, @GetCurrentUserId() id: string) {
    // console.log(req);
    client.join(name);
    this.server.to(name).emit('roomJoined', name);
    if (this.players.p1 == null || this.players.p1 == id) {
      this.players.p1 = id;
      return 1;
    }
    else {
      try {
        this.getIntervals();
      } catch (e) {
        this.addInterval('start', 10);
      }
      this.players.p2 = id;
      return 2
    }
  }
}
