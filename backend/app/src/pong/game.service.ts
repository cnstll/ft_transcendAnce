import { Inject, Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Server } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { Socket } from 'socket.io';
import { Status, Game, DoubleKeyMap, GameMode } from './entities/game.entities';
import { Root } from 'protobufjs';

@Injectable()
export class GameService {
  GameMap = new DoubleKeyMap();
  gameInfo = this.protobuf.lookupType('userpackage.GameInfo');
  playerInfo = this.protobuf.lookupType('userpackage.PlayerInfo');
  buf: Buffer;

  constructor(
    @Inject('PROTOBUFROOT') private protobuf: Root,
    private prismaService: PrismaService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  mutateGameStatus(game: Game, status: Status, server: Server) {
    game.status = status;
    if (status === Status.DONE) {
      this.GameMap.delete(game.p1id);
    }
    server.to(game.gameRoomId).emit('gameStatus', {
      gameId: game.gameRoomId,
      status: game.status,
      winner: '',
      player1id: game.p1id,
      player2id: game.p2id,
      player1score: game.p1s,
    });
  }

  async join(client: Socket, userId: string, server: Server, mode: GameMode) {
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
          this.addInterval(game.gameRoomId, userId, 16, server);
        }
        if (game.p2id === userId) return { playerNumber: 2 };
        return { playerNumber: 1 };
      }
      if ((game = this.GameMap.matchPlayer(userId))) {
        client.join(game.gameRoomId);
        this.mutateGameStatus(game, Status.PLAYING, server);
        this.addInterval(game.gameRoomId, userId, 16, server);
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
      const game = this.GameMap.getGame(winnerId);

      if (winnerId === game.p1id) game.p1s = 10;
      else game.p2s = 10;
      // this.mutateGameStatus(game, Status.OVER, server);
      this.addWinningTimeout(5000, server, winnerId);
      server.emit('matchFinished');
    };

    const timeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(name, timeout);
  }

  addWinningTimeout(milliseconds: number, server: Server, winnerId: string) {
    const callback = () => {
      const game = this.GameMap.getGame(winnerId);
      game.saveGameResults(this.prismaService);
      this.mutateGameStatus(game, Status.DONE, server);
    };

    setTimeout(callback, milliseconds);
  }

  pause(id: string, server: Server) {
    const game = this.GameMap.getGame(id);
    if (game) {
      switch (game.status) {
        case Status.PLAYING:
          this.deleteInterval(game.gameRoomId);
          this.mutateGameStatus(game, Status.PAUSED, server);
          if (id === game.p1id) {
            this.addTimeout(game.gameRoomId, 10000, server, game.p2id);
          } else {
            this.addTimeout(game.gameRoomId, 10000, server, game.p1id);
          }
          break;

        case Status.PENDING:
          this.GameMap.delete(id);
          break;
      }
    }
  }

  create(encoded: Uint8Array, userId: string) {
    const decoded = this.playerInfo.decode(encoded).toJSON();
    const y = decoded.yPos;
    const game: Game = this.GameMap.getGame(userId);
    if (game !== undefined) {
      if (game.p1id === userId) {
        game.movePaddle(1, y);
      } else {
        game.movePaddle(2, y);
      }
    }
  }

  moveBall(id: string, server: Server) {
    const game: Game = this.GameMap.getGame(id);
    game.moveBall(this, server);
    return game.returnGameInfo();
  }

  createGame(p1: string, mode: GameMode) {
    const game = new Game(mode);
    this.GameMap.setPlayer1(p1, game);
    return game;
  }

  winGame(game: Game, server: Server) {
    this.deleteInterval(game.gameRoomId);
    this.mutateGameStatus(game, Status.OVER, server);
    if (game.p1s === 10) this.addWinningTimeout(5000, server, game.p1id);
    else if (game.p2s === 10) this.addWinningTimeout(5000, server, game.p2id);
  }

  addInterval(
    gameRoomId: string,
    userId: string,
    milliseconds: number,
    server: Server,
  ) {
    const callback = () => {
      const payload = this.moveBall(userId, server);
      this.gameInfo.verify(payload);
      const message = this.gameInfo.create(payload);
      const encoded = this.gameInfo.encode(message).finish();
      server.to(gameRoomId).volatile.timeout(5000).emit('GI', encoded);
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
