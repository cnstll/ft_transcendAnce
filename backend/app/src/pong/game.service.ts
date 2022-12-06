import { Inject, Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Server } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { Socket } from 'socket.io';
import { Status, Game, DoubleKeyMap, GameMode } from './entities/game.entities';
import { Root } from 'protobufjs';
import { socketToUserId } from 'src/user/socketToUserIdStorage.service';

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
    if (status === Status.DONE && game.p1id) {
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

  refuseInvite(client: Socket, userId: string) {
    const challengerSocket = socketToUserId.getFromUserId(userId);
    if (challengerSocket) {
      if (this.GameMap.getGame(userId)) {
        client.to(challengerSocket).emit('inviteRefused', 'invite refused');
      }
      try {
        const game = this.GameMap.getGame(userId);
        if (game) {
          this.deleteTimeout(game.gameRoomId);
        }
        this.GameMap.delete(userId);
      } catch (error) {}
    }
  }

  acceptInvite(userId: string) {
    const game = this.GameMap.getGame(userId);
    if (game) this.deleteTimeout(game.gameRoomId);
  }

  async createInvitationGame(
    client: Socket,
    server: Server,
    p1id: string,
    p2id: string,
    gameMode: GameMode,
  ) {
    const opponentSocket = socketToUserId.getFromUserId(p2id);
    if (opponentSocket) {
      if (this.GameMap.getGame(p2id) !== null) {
        server
          .to(client.id)
          .emit(
            'inviteRefused',
            'Your opponent already has an invite pending, try again later',
          );
        return 'inviteFailed';
      }
      try {
        const challenger = await this.prismaService.user.findUnique({
          where: {
            id: p1id,
          },
          select: {
            id: true,
            avatarImg: true,
            nickname: true,
            eloScore: true,
            status: true,
            twoFactorAuthenticationSet: true,
          },
        });

        this.createGame(p1id, gameMode, p2id);
        await this.join(client, p1id, server, gameMode);
        client.to(opponentSocket).emit('invitedToGame', challenger);
        return 'gameJoined';
      } catch (error) {
        return;
      }
    }
  }

  // <<<<<<< Updated upstream
  async leaveWatch(client: Socket, playerId: string) {
    const game = this.GameMap.getGame(playerId);
    if (game !== null) {
      await client.leave(game.gameRoomId);
    }
  }

  async watch(client: Socket, playerId: string, server: Server) {
    const game = this.GameMap.getGame(playerId);
    if (game !== null) {
      await client.join(game.gameRoomId);
      server.to(client.id).emit('gameStatus', {
        gameId: game.gameRoomId,
        status: game.status,
        winner: '',
        player1id: game.p1id,
        player2id: game.p2id,
        player1score: game.p1s,
      });
    }
    //TODO make this return dynamic
    // =======
    //   async watch(client: Socket, playerId: string) {
    //     const game = this.GameMap.getGame(playerId);
    //     if (game) await client.join(game.gameRoomId);
    // >>>>>>> Stashed changes
    return { playerNumber: 1 };
  }

  async join(client: Socket, userId: string, server: Server, mode: GameMode) {
    let game: Game | null;

    if (this.GameMap.size === 0) {
      game = this.createGame(userId, mode);
      await client.join(game.gameRoomId);
      return { playerNumber: 1 };
    } else {
      if ((game = this.GameMap.rejoinGame(userId)) != null) {
        await client.join(game.gameRoomId);
        if (game.status === Status.PAUSED) {
          this.mutateGameStatus(game, Status.PLAYING, server);
          this.deleteTimeout(game.gameRoomId);
          this.addInterval(game.gameRoomId, userId, 16, server);
        } else if (game.status === Status.PENDING && game.p2id === userId) {
          this.mutateGameStatus(game, Status.PLAYING, server);
          this.addInterval(game.gameRoomId, userId, 16, server);
        }
        if (game.p2id === userId) return { playerNumber: 2 };
        return { playerNumber: 1 };
      }
      if ((game = this.GameMap.matchPlayer(userId))) {
        await client.join(game.gameRoomId);
        this.mutateGameStatus(game, Status.PLAYING, server);
        this.addInterval(game.gameRoomId, userId, 16, server);
        return { playerNumber: 2 };
      }
      game = this.createGame(userId, mode);
      await client.join(game.gameRoomId);
      return { playerNumber: 1 };
    }
  }

  rejoin(userId: string) {
    let game: Game | null;
    if ((game = this.GameMap.getGame(userId))) {
      return game.mode;
    }
    return null;
  }

  deleteTimeout(name: string) {
    try {
      this.schedulerRegistry.deleteTimeout(name);
    } catch (error) {}
  }

  addTimeout(
    name: string,
    milliseconds: number,
    server: Server,
    winnerId: string,
  ) {
    const callback = () => {
      const game = this.GameMap.getGame(winnerId);

      if (!game) return;
      if (winnerId === game.p1id) game.p1s = 10;
      else game.p2s = 10;
      if (game.status !== Status.PAUSED) this.deleteInterval(name);
      this.mutateGameStatus(game, Status.OVER, server);
      this.addWinningTimeout(5000, server, winnerId);
      server.emit('matchFinished');
    };

    const timeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(name, timeout);
  }

  addInvitationTimeout(
    name: string,
    server: Server,
    socketId: string,
    userId: string,
  ) {
    const callback = () => {
      this.GameMap.delete(userId);
      server
        .to(socketId)
        .emit('inviteRefused', 'Your opponent is to slow for you');
    };
    const timeoutInMs = 10000;
    const timeout = setTimeout(callback, timeoutInMs);
    this.schedulerRegistry.addTimeout(name, timeout);
  }

  addWinningTimeout(milliseconds: number, server: Server, winnerId: string) {
    const callback = () => {
      const game = this.GameMap.getGame(winnerId);
      if (!game) return;
      void game.saveGameResults(this.prismaService);
      this.mutateGameStatus(game, Status.DONE, server);
    };

    setTimeout(callback, milliseconds);
  }

  pause(id: string, server: Server) {
    const game = this.GameMap.getGame(id);
    if (game && game.status === Status.PAUSED) {
      this.deleteTimeout(game.gameRoomId);
      this.GameMap.delete(id);
    } else if (game && game.status === Status.PLAYING) {
      if (game.p1id === id || game.p2id === id) {
        this.deleteInterval(game.gameRoomId);
        this.mutateGameStatus(game, Status.PAUSED, server);
        if (id === game.p1id && game.p2id) {
          this.addTimeout(game.gameRoomId, 10000, server, game.p2id);
        } else if (game.p1id) {
          this.addTimeout(game.gameRoomId, 10000, server, game.p1id);
        }
      }
    }
  }

  create(encoded: Uint8Array, userId: string) {
    const decoded = this.playerInfo.decode(encoded).toJSON();
    const y: number = decoded.yPos;
    const game: Game | null = this.GameMap.getGame(userId);
    if (!game) return;
    if (game !== undefined) {
      if (game.p1id === userId) {
        game.movePaddle(1, y);
      } else {
        game.movePaddle(2, y);
      }
    }
  }

  moveBall(id: string, server: Server) {
    const game: Game | null = this.GameMap.getGame(id);
    if (!game) return;
    game.moveBall(this, server);
    return game.returnGameInfo();
  }

  createGame(p1: string, mode: GameMode, p2?: string) {
    const game = new Game(mode);
    this.GameMap.setPlayer1(p1, game);
    if (p2 !== undefined) {
      this.GameMap.setPlayer2(p2, game);
    }
    return game;
  }

  winGame(game: Game, server: Server) {
    this.deleteInterval(game.gameRoomId);
    this.mutateGameStatus(game, Status.OVER, server);
    if (game.p1s === 10 && game.p1id)
      this.addWinningTimeout(5000, server, game.p1id);
    else if (game.p2s === 10 && game.p2id)
      this.addWinningTimeout(5000, server, game.p2id);
  }

  addInterval(
    gameRoomId: string,
    userId: string,
    milliseconds: number,
    server: Server,
  ) {
    const callback = () => {
      const payload = this.moveBall(userId, server);
      if (!payload) return;
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
