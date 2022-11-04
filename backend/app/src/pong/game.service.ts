import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Server } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { Socket } from 'socket.io';
import { PositionDto } from './dto/position.dto';
import { Status, Game, GameMode } from './entities/game.entities';

@Injectable()
export class GameService {
  GameMap = new Map<string, Game>();

  constructor(
    private prismaService: PrismaService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  join(
    name: string,
    client: Socket,
    id: string,
    server: Server,
    mode: GameMode,
  ) {
    if (name === '') {
      return this.joinRandom(client, id, server, mode);
    } else {
      return this.joinSpecific(name, client, id, server);
    }
  }

  mutateGameStatus(game: Game, status: Status, server: Server) {
    game.status = status;
    server.to(game.gameRoomId).emit('gameStatus', {
      gameId: game.gameRoomId,
      status: game.status,
      winner: '',
    });
  }
  joinSpecific(name: string, client: Socket, id: string, server: Server) {
    const game: Game = this.GameMap.get(name);

    if (game.p1id === id) {
      client.join(name);
      this.mutateGameStatus(game, game.status, server);
      if (game.status == Status.PAUSED) {
        this.deleteTimeout(game.gameRoomId);
        this.mutateGameStatus(game, Status.PLAYING, server);
        this.addInterval(game.gameRoomId, 5, server);
      }
      return { gameId: game.gameRoomId, playerNumber: 1 };
    } else if (game.p2id === id) {
      client.join(name);
      this.mutateGameStatus(game, game.status, server);
      if (game.status == Status.PAUSED) {
        this.deleteTimeout(game.gameRoomId);
        this.mutateGameStatus(game, Status.PLAYING, server);
        this.addInterval(game.gameRoomId, 5, server);
      }
      return { gameId: game.gameRoomId, playerNumber: 2 };
    }
  }

  joinRandom(client: Socket, id: string, server: Server, mode: GameMode) {
    let game: Game;

    if (this.GameMap.size === 0) {
      game = this.createGame(id, null, mode);
      client.join(game.gameRoomId);
      this.mutateGameStatus(game, game.status, server);
      return { gameId: game.gameRoomId, playerNumber: 1 };
    } else {
      for (const [gameRoomId, game] of this.GameMap) {
        if (game.p2id === null) {
          game.p2id = id;
          client.join(gameRoomId);
          this.mutateGameStatus(game, Status.PLAYING, server);
          this.addInterval(gameRoomId, 5, server);
          return { gameId: gameRoomId, playerNumber: 2 };
        }
      }
      game = this.createGame(id, null, mode);
      return { gameId: game.gameRoomId, playerNumber: 1 };
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
      console.log('timeout started, deleting game in 5 seconds');
      const game = this.GameMap.get(name);
      this.mutateGameStatus(game, Status.DONE, server);
      game.claimVictory(winnerId, this.prismaService);
      this.GameMap.delete(name);
    };

    const timeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(name, timeout);
  }

  pause(id: string, server: Server) {
    for (const [gameRoomId, game] of this.GameMap) {
      if (game.p1id === id || game.p2id === id) {
        this.deleteInterval(gameRoomId);
        this.mutateGameStatus(game, Status.PAUSED, server);
        this.addTimeout(gameRoomId, 5000, server, id);
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

  createGame(p1: string, p2: string | null, mode: GameMode) {
    const game = new Game(mode);
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
        this.deleteInterval(message.gameRoomId);
        this.mutateGameStatus(game, Status.DONE, server);
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
