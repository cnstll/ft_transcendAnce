import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Server } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { Socket } from 'socket.io';
import { PositionDto } from './dto/position.dto';
import { Status, Game, DoubleKeyMap } from './entities/game.entities';

@Injectable()
export class GameService {
  GameMap = new DoubleKeyMap();

  constructor(
    private prismaService: PrismaService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  join(client: Socket, userId: string, server: Server) {
    return this.joinNew(client, userId, server);
  }

  mutateGameStatus(game: Game, status: Status, server: Server) {
    game.status = status;
    server.to(game.gameRoomId).emit('gameStatus', {
      gameId: game.gameRoomId,
      status: game.status,
      winner: '',
    });
  }

  joinNew(client: Socket, userId: string, server: Server) {
    let game: Game;

    if (this.GameMap.size == 0) {
      game = this.createGame(userId);
      client.join(game.gameRoomId);
      this.mutateGameStatus(game, game.status, server);
      return { playerNumber: 1 };
    } else {
      if ((game = this.GameMap.rejoinGame(userId)) != null) {
        client.join(game.gameRoomId);
        if (game.status === Status.PAUSED) {
          this.mutateGameStatus(game, Status.PLAYING, server);
          this.deleteTimeout(game.gameRoomId);
          this.addInterval(game.gameRoomId, userId, 5, server);
        }
        return { playerNumber: 1 };
      }
      if ((game = this.GameMap.matchPlayer(userId))) {
        client.join(game.gameRoomId);
        this.mutateGameStatus(game, Status.PLAYING, server);
        this.addInterval(game.gameRoomId, userId, 5, server);
        return { playerNumber: 2 };
      }
      game = this.createGame(userId);
      return { playerNumber: 1 };
    }
  }

  deleteTimeout(name: string) {
    this.schedulerRegistry.deleteTimeout(name);
  }

  addTimeout(
    name: string,
    milliseconds: number,
    server: Server,
    winnerId: string,
  ) {
    const callback = () => {
      console.log('timeout started, deleting game in 10 seconds');
      const game = this.GameMap.getGame(winnerId);
      this.mutateGameStatus(game, Status.DONE, server);
      game.claimVictory(winnerId, this.prismaService);
      this.GameMap.delete(winnerId);
    };

    const timeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(name, timeout);
  }

  pause(id: string, server: Server) {
    const game = this.GameMap.getGame(id);
    if (game && game.status == Status.PLAYING) {
      // for (const [gameRoomId, game] of this.GameMap) {
      if (game.p1id === id || game.p2id === id) {
        this.deleteInterval(game.gameRoomId);
        this.mutateGameStatus(game, Status.PAUSED, server);
        if (id === game.p1id) {
          this.addTimeout(game.gameRoomId, 10000, server, game.p2id);
        } else {
          this.addTimeout(game.gameRoomId, 10000, server, game.p1id);
        }
      }
      // }
    }
  }

  create(y: number, userId: string) {
    const game: Game = this.GameMap.getGame(userId);
    if (game !== undefined) {
      if (game.p1id === userId) {
        game.movePaddle(1, y);
      } else {
        game.movePaddle(2, y);
      }
      return game;
    }
    return null;
  }

  moveBall(id: string) {
    const game: Game = this.GameMap.getGame(id);

    game.moveBall();
    return game.returnGameInfo();
  }

  createGame(p1: string) {
    const game = new Game();
    // this.GameMap.setGame(p1, p2, game);
    this.GameMap.setPlayer1(p1, game);
    // this.GameMap.set(game.gameRoomId, game);
    // game.p1id = p1;
    // game.p2id = p2;
    return game;
  }

  addInterval(
    gameRoomId: string,
    userId: string,
    milliseconds: number,
    server: Server,
  ) {
    const callback = () => {
      const message = this.moveBall(userId);
      if (message.p2s >= 10 || message.p1s >= 10) {
        const game = this.GameMap.getGame(userId);
        this.deleteInterval(message.gameRoomId);
        this.mutateGameStatus(game, Status.DONE, server);
        game.saveGameResults(this.prismaService);
        this.GameMap.delete(userId);
      }
      server.to(message.gameRoomId).emit('updatedGameInfo', message);
    };

    const interval = setInterval(callback, milliseconds);
    this.schedulerRegistry.addInterval(gameRoomId, interval);
  }

  deleteInterval(name: string) {
    this.schedulerRegistry.deleteInterval(name);
  }

  getInterval(name: string) {
    const interval = this.schedulerRegistry.getInterval(name);
    return interval;
  }
}
