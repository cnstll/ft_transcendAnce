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
import { Game, Status } from './entities/position.entity';
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

  roomMap = new Map<string, Game>();

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
      this.roomMap.get(message.gameRoom)['status'] = Status.DONE;
      this.server.to(message.gameRoom).emit('gameStatus', {
        gameId: message.gameRoom,
        status: 'DONE',
        winner: '',
      });
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
      if (message.p2s >= 10 || message.p1s >= 10) {
        this.deleteInterval(message.gameRoom);
        this.messagesService.deleteGame(message.gameRoom);
        this.roomMap.get(message.gameRoom)['status'] = Status.DONE;
        this.server
          .to(message.gameRoom)
          .emit('gameStatus', { gameId: name, status: 'DONE', winner: '' });
        this.roomMap.delete(message.gameRoom);
      }
      this.server.to(message.gameRoom).emit('message', message);
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
    let pNumber: number;
    const game: Game = {
      p1: null,
      p2: null,
      roomName: name,
      status: Status.PENDING,
    };
    if (name == '') {
      if (this.roomMap.size == 0) {
        name = this.messagesService.makeid(5);
        this.roomMap.set(name, game);
      } else {
        for (const [key, value] of this.roomMap) {
          if (value.p2 == null) {
            name = key;
            pNumber = 2;
          }
        }
      }
    }

    if (this.roomMap.get(name)['p1'] == null) {
      // here I am joining an empty room, by default, I am player one
      this.roomMap.get(name)['p1'] = id;
      this.roomMap.get(name)['status'] = Status.PENDING;
      pNumber = 1;
    } else {
      //here i am either a second player joining an existing room or a player 1 reconnection
      if (this.roomMap.get(name)['p1'] == id) {
        // this.roomMap.get(name)['status'] = Status.PLAYING;
        pNumber = 1;
      } else if (this.roomMap.get(name)['p2'] == id) {
        this.roomMap.get(name)['status'] = Status.PLAYING;
        pNumber = 2;
      } else {
        this.roomMap.get(name)['p2'] = id;
        this.roomMap.get(name)['status'] = Status.PLAYING;
        this.messagesService.createGame(name);
        pNumber = 2;
        try {
          this.getInterval(name);
        } catch (e) {
          this.addInterval(name, 10);
        }
      }
    }
    client.join(name);
    this.server.to(name).emit('gameStatus', {
      gameId: name,
      status: this.roomMap.get(name)['status'],
      winner: '',
    });

    return {
      gameId: name,
      pNumber: pNumber,
    };
  }
}
