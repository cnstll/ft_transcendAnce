import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Server } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { Socket } from 'socket.io';
import { Status, Game, DoubleKeyMap, GameMode } from './entities/game.entities';

@Injectable()
export class GameService {
  GameMap = new DoubleKeyMap();

  constructor(
    private prismaService: PrismaService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  mutateGameStatus(game: Game, status: Status, server: Server) {
    game.status = status;
    server.to(game.gameRoomId).emit('gameStatus', {
      gameId: game.gameRoomId,
      status: game.status,
      winner: '',
    });
  }

  join(client: Socket, userId: string, server: Server, mode: GameMode) {
    let game: Game;

    if (this.GameMap.size === 0) {
      game = this.createGame(userId, mode);
      client.join(game.gameRoomId);
      this.mutateGameStatus(game, game.status, server);
      return { playerNumber: 1 };
    } else {
      if ((game = this.GameMap.rejoinGame(userId)) != null) {
        client.join(game.gameRoomId);
        if (game.status === Status.PAUSED) {
          this.mutateGameStatus(game, Status.PLAYING, server);
          this.deleteTimeout(game.gameRoomId);
          this.addInterval(game.gameRoomId, userId, 30, server);
        }
        if (game.p2id === userId) return { playerNumber: 2 };
        return { playerNumber: 1 };
      }
      if ((game = this.GameMap.matchPlayer(userId))) {
        client.join(game.gameRoomId);
        this.mutateGameStatus(game, Status.PLAYING, server);
        this.addInterval(game.gameRoomId, userId, 30, server);
        return { playerNumber: 2 };
      }
      game = this.createGame(userId, mode);
      return { playerNumber: 1 };
    }
  }

  rejoin(userId: string) {
    let game: Game;
    if ((game = this.GameMap.getGame(userId))) {
      return game.mode;
    }
    return null;
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
    if (game && game.status === Status.PLAYING) {
      if (game.p1id === id || game.p2id === id) {
        this.deleteInterval(game.gameRoomId);
        this.mutateGameStatus(game, Status.PAUSED, server);
        if (id === game.p1id) {
          this.addTimeout(game.gameRoomId, 10000, server, game.p2id);
        } else {
          this.addTimeout(game.gameRoomId, 10000, server, game.p1id);
        }
      }
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
    // TODO i shouldnt have to resend everything here
  }

  createGame(p1: string, mode: GameMode) {
    const game = new Game(mode);
    this.GameMap.setPlayer1(p1, game);
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
      //  I want to change this to make the game more blazingly fast
      if (message.p2s >= 10 || message.p1s >= 10) {
        const game = this.GameMap.getGame(userId);
        this.deleteInterval(gameRoomId);
        this.mutateGameStatus(game, Status.DONE, server);
        game.saveGameResults(this.prismaService);
        this.GameMap.delete(userId);
      }
      server.to(gameRoomId).emit('updatedGameInfo', message);
      server.emit('matchFinished');
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
