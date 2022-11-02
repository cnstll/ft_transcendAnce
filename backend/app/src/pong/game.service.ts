import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Server } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { Socket } from 'socket.io';
import { PositionDto } from './dto/position.dto';
import { Status, Game } from './entities/game.entities';

@Injectable()
export class GameService {
  GameMap = new Map<string, Game>();

  constructor(
    private prismaService: PrismaService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  join(name: string, client: Socket, id: string, server: Server) {
    if (name === '') {
      return this.joinRandom(client, id, server);
    } else {
      return this.joinSpecific(name, client, id, server);
    }
  }

  joinSpecific(name: string, client: Socket, id: string, server: Server) {
    const game: Game = this.GameMap.get(name);

    if (game.p1id === id) {
      client.join(name);
      server.to(name).emit('gameStatus', {
        gameId: name,
        status: game.status,
        winner: '',
      });
      if (game.status === Status.PLAYING) {
        this.addInterval(game.gameRoomId, 5, server);
      }
      return { gameId: game.gameRoomId, playerNumber: 1 };
    } else if (game.p2id === id) {
      client.join(name);
      server.to(name).emit('gameStatus', {
        gameId: name,
        status: game.status,
        winner: '',
      });
      if (game.status === Status.PLAYING) {
        this.addInterval(game.gameRoomId, 5, server);
      }
      return { gameId: game.gameRoomId, playerNumber: 2 };
    }
  }

  joinRandom(client: Socket, id: string, server: Server) {
    let game: Game;

    if (this.GameMap.size === 0) {
      game = this.createGame(id, null);
      client.join(game.gameRoomId);
      server.to(game.gameRoomId).emit('gameStatus', {
        gameId: game.gameRoomId,
        status: game.status,
        winner: '',
      });
      return { gameId: game.gameRoomId, playerNumber: 1 };
    } else {
      for (const [gameRoomId, game] of this.GameMap) {
        if (game.p2id === null) {
          game.p2id = id;
          game.status = Status.PLAYING;
          client.join(gameRoomId);
          server.to(gameRoomId).emit('gameStatus', {
            gameId: gameRoomId,
            status: game.status,
            winner: '',
          });
          this.addInterval(gameRoomId, 5, server);
          return { gameId: gameRoomId, playerNumber: 2 };
        }
      }
      game = this.createGame(id, null);
      return { gameId: game.gameRoomId, playerNumber: 1 };
    }
  }

  pause(id: string) {
    for (const [gameRoomId, game] of this.GameMap) {
      if (game.p1id === id || game.p2id === id) {
        this.deleteInterval(gameRoomId);
      }
    }
  }
  create(positionDto: PositionDto) {
    const game: Game = this.GameMap.get(positionDto.room);
    if (game !== undefined) {
      game.movePaddle(positionDto.player, positionDto.y);
      return game;
    }
    return null;
  }

  moveBall(roomName: string) {
    const game: Game = this.GameMap.get(roomName);
    game.moveBall();
    return game.returnGameInfo();
  }

  createGame(p1: string, p2: string | null) {
    const game = new Game();
    this.GameMap.set(game.gameRoomId, game);
    game.p1id = p1;
    game.p2id = p2;
    return game;
  }

  addInterval(name: string, milliseconds: number, server: Server) {
    const callback = () => {
      const message = this.moveBall(name);
      if (message.p2s >= 10 || message.p1s >= 10) {
        const game = this.GameMap.get(message.gameRoomId);
        game.status = Status.DONE;
        this.deleteInterval(message.gameRoomId);
        server
          .to(message.gameRoomId)
          .emit('gameStatus', { gameId: name, status: 'DONE', winner: '' });
        game.saveGameResults(this.prismaService);
        this.GameMap.delete(message.gameRoomId);
      }
      server.to(message.gameRoomId).emit('updatedGameInfo', message);
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
}
