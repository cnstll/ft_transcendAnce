import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { GameService } from '../game.service';
import { Server } from 'socket.io';

export interface HandshakeRequest extends Request {
  handshake?: { headers: { cookie: string } };
}

export interface TwoFaRequest extends Request {
  // req.cookies &&
  // 'temporaryToken' in req.cookies &&
  // req.cookies.temporaryToken.length > 0
  cookies: { temporaryToken: string };
}

export interface JwtRequest extends Request {
  cookies: { jwtToken: string };
}

export enum UserConnectionStatus {
  OFFLINE = 'OFFLINE',
  ONLINE = 'ONLINE',
  PLAYING = 'PLAYING',
}

export interface FrontendUser {
  id: string;
  avatarImg: string;
  nickname: string;
  eloScore: number;
  twoFactorAuthenticationSet: boolean;
}

export enum GameMode {
  CLASSIC = 'CLASSIC',
  MAYHEM = 'MAYHEM',
  HOCKEY = 'HOCKEY',
}
const generateRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export class DoubleKeyMap {
  playerMap = new Map<string, Game>();
  size = 0;

  getGame(playerId: string) {
    const game = this.playerMap.get(playerId);
    if (game !== undefined) {
      return game;
    }
    return null;
  }

  rejoinGame(playerId: string) {
    const game: Game | undefined = this.playerMap.get(playerId);
    if (game !== undefined) {
      return game;
    }
    return null;
  }

  matchPlayer(player2Id: string) {
    for (const [_, game] of this.playerMap) {
      if (game.p2id === undefined && _) {
        // the above is ugly but a linting rule is forcing me to add it
        game.p2id = player2Id;
        this.playerMap.set(player2Id, game);
        return game;
      }
    }
    return null;
  }
  setPlayer1(player1Id: string, game: Game) {
    game.p1id = player1Id;
    game.p2id = undefined;
    this.playerMap.set(player1Id, game);
    this.size++;
  }

  setPlayer2(player2Id: string, game: Game) {
    game.p2id = player2Id;
    this.playerMap.set(player2Id, game);
  }

  delete(userId: string) {
    const game = this.playerMap.get(userId);
    if (game?.p1id === userId && game.p2id) {
      this.playerMap.delete(game.p2id);
    } else if (game?.p1id) {
      this.playerMap.delete(game.p1id);
    }
    this.playerMap.delete(userId);
    this.size--;
  }
}

export class Game {
  constructor(mode: GameMode) {
    this.status = Status.PENDING;
    this.gameRoomId = this.makeid(5);
    this.status = Status.PENDING;
    this.mode = mode;
  }

  gameConstants = {
    relativeGameWidth: 1000,
    relativeMiddle: 500,
    relativeGameHeight: 1000,
    player1PaddlePosX: 80,
    player2PaddlePosX: 920,
    paddleWidth: 10,
    ballHeight: 30,
    maxSpeed: 6,
    speed: 0,
    speeds: [7, 8, 10, 12, 14, 15, 20],
  };
  gameRoomId: string;
  p1id: string | undefined = undefined;
  p2id: string | undefined = undefined;
  status: Status;
  dirx = this.gameConstants.speeds[0];
  diry = 0.0;
  p1x = 5;
  p1y = 50;
  p2x = 95;
  p2y = 50;
  bx = 500;
  by = 55;
  p1s = 0;
  p2s = 0;
  paddleSize = 100;
  mode: GameMode = GameMode.CLASSIC;

  moveBall(gameService: GameService, server: Server) {
    if (
      this.by + this.gameConstants.ballHeight >=
      this.gameConstants.relativeGameHeight
    ) {
      this.by =
        this.gameConstants.relativeGameHeight - this.gameConstants.ballHeight;
      this.diry = this.diry * -1;
    }
    if (this.by <= 0) {
      this.by = 0;
      this.diry = this.diry * -1;
    }
    if (this.bx == this.gameConstants.player1PaddlePosX) {
      if (
        this.by + this.gameConstants.ballHeight >=
          this.p1y - this.paddleSize / 2 - 3 &&
        this.by <= this.p1y + this.paddleSize / 2 + 3
      ) {
        switch (this.mode) {
          case GameMode.MAYHEM: {
            if (this.dirx > 0) {
              if (this.gameConstants.speed < this.gameConstants.maxSpeed) {
                this.gameConstants.speed = 5;
                this.dirx = this.gameConstants.speeds[5];
              }
            } else {
              this.dirx = this.dirx * -1;
              if (this.gameConstants.speed < this.gameConstants.maxSpeed) {
                // this.dirx += this.gameConstants.speedIncrease;
                this.dirx =
                  this.gameConstants.speeds[this.gameConstants.speed++];
              }
            }
            break;
          }
          case GameMode.CLASSIC: {
            this.dirx = this.dirx * -1;
            if (this.gameConstants.speed < this.gameConstants.maxSpeed) {
              // this.dirx += this.gameConstants.speedIncrease;
              this.dirx = this.gameConstants.speeds[this.gameConstants.speed++];
            }
            break;
          }
        }
        // this number stays magic because it actually is magic
        this.diry = (this.by - this.p1y) / 2;
      }
    }

    if (this.bx == this.gameConstants.player2PaddlePosX) {
      if (
        this.by + this.gameConstants.ballHeight >=
          this.p2y - this.paddleSize / 2 &&
        this.by <= this.p2y + this.paddleSize / 2
      ) {
        switch (this.mode) {
          case GameMode.MAYHEM: {
            if (this.dirx < 0) {
              if (this.gameConstants.speed < this.gameConstants.maxSpeed) {
                this.gameConstants.speed = 5;
                this.dirx = -this.gameConstants.speeds[5];
              }
            } else {
              this.dirx = this.dirx * -1;
              if (this.gameConstants.speed < this.gameConstants.maxSpeed) {
                // this.dirx -= this.gameConstants.speedIncrease;
                this.dirx =
                  -this.gameConstants.speeds[this.gameConstants.speed++];
              }
            }
            break;
          }
          case GameMode.CLASSIC: {
            this.dirx = this.dirx * -1;
            if (this.gameConstants.speed < this.gameConstants.maxSpeed) {
              // this.dirx -= this.gameConstants.speedIncrease;
              this.dirx =
                -this.gameConstants.speeds[this.gameConstants.speed++];
            }
            break;
          }
        }
        this.diry = this.by - this.p2y;
      }
    }

    if (this.bx <= 0) {
      this.p2s += 1;
      if (this.p2s >= 10) {
        gameService.winGame(this, server);
      }
      switch (this.mode) {
        case GameMode.CLASSIC: {
          this.dirx = this.gameConstants.speeds[(this.gameConstants.speed = 0)];
          this.bx = this.gameConstants.relativeMiddle;
          this.by = this.gameConstants.relativeMiddle;
          this.diry = generateRandomNumber(-20, 20);
          break;
        }

        case GameMode.MAYHEM: {
          this.bx = 0;
          this.dirx = this.gameConstants.speeds[(this.gameConstants.speed = 1)];
          break;
        }
      }
    }

    if (this.bx >= this.gameConstants.relativeGameWidth) {
      this.p1s += 1;
      if (this.p1s >= 10) {
        gameService.winGame(this, server);
      }
      switch (this.mode) {
        case GameMode.CLASSIC: {
          // this.dirx = -this.gameConstants.initialSpeed;
          this.dirx =
            -this.gameConstants.speeds[(this.gameConstants.speed = 0)];
          this.bx = this.gameConstants.relativeMiddle;
          this.by = this.gameConstants.relativeMiddle;
          this.diry = generateRandomNumber(-20, 20);
          break;
        }

        case GameMode.MAYHEM: {
          this.bx = this.gameConstants.relativeGameWidth;
          this.dirx =
            -this.gameConstants.speeds[(this.gameConstants.speed = 1)];
          break;
        }
      }
    }

    this.bx += this.dirx;
    this.by += this.diry;
    return this;
  }

  makeid(length: number) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  movePaddle(player: number, pos: number) {
    if (player === 1) {
      this.p1y = pos;
    } else {
      this.p2y = pos;
    }
  }

  returnGameInfo() {
    return {
      p1y: this.p1y,
      p2y: this.p2y,
      bx: this.bx,
      by: this.by,
      p1s: this.p1s,
      p2s: this.p2s,
    };
  }

  computeElo(RA: number, RB: number) {
    const exponent = (RB - RA) / 400;
    const intermediary = Math.pow(10, exponent);
    const newElo: number = 1 / (1 + intermediary);
    return newElo;
  }

  async getUserElo(userId: string, prismaService: PrismaService) {
    try {
      const user = await prismaService.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          eloScore: true,
        },
      });
      if (user) return user.eloScore;
    } catch (error) {
      console.log(error);
      //TODO should this error be handled? should be excedingly rare
    }
  }

  async updateUserElo(
    userId: string,
    newElo: number,
    prismaService: PrismaService,
  ) {
    await prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        eloScore: newElo,
      },
    });
  }

  computeExpectedElos(eloPlayer1: number, eloPlayer2: number) {
    const expectedElo1 = this.computeElo(eloPlayer1, eloPlayer2);
    const expectedElo2 = this.computeElo(eloPlayer2, eloPlayer1);
    return {
      expectedEloPlayer1: expectedElo1,
      expectedEloPlayer2: expectedElo2,
    };
  }
  // Winner is a boolean set to 1 if player 1 won, and zero if he lost
  async getNewElos(prismaService: PrismaService, winner: boolean) {
    const newElos: { eloPlayer1: number; eloPlayer2: number } = {
      eloPlayer1: 0,
      eloPlayer2: 0,
    };
    if (typeof this.p1id === 'string' && typeof this.p2id === 'string') {
      const eloPlayer1 = await this.getUserElo(this.p1id, prismaService);
      const eloPlayer2 = await this.getUserElo(this.p2id, prismaService);
      if (eloPlayer1 && eloPlayer2) {
        const expectedElos = this.computeExpectedElos(eloPlayer1, eloPlayer2);

        if (winner) {
          newElos.eloPlayer1 = Math.ceil(
            eloPlayer1 + 15 * (1 - expectedElos.expectedEloPlayer1),
          );
          newElos.eloPlayer2 = Math.ceil(
            eloPlayer2 + 15 * (0 - expectedElos.expectedEloPlayer2),
          );
        } else {
          newElos.eloPlayer1 = Math.ceil(
            eloPlayer1 + 15 * (0 - expectedElos.expectedEloPlayer1),
          );
          newElos.eloPlayer2 = Math.ceil(
            eloPlayer2 + 15 * (1 - expectedElos.expectedEloPlayer2),
          );
        }
        if (newElos.eloPlayer2 < 100) {
          newElos.eloPlayer2 = 100;
        }
        if (newElos.eloPlayer1 < 100) {
          newElos.eloPlayer2 = 100;
        }
        return newElos;
      }
      return null;
    }
  }

  async saveGameResults(prismaService: PrismaService) {
    if (this.p2id) {
      await prismaService.user.update({
        where: {
          id: this.p1id,
        },
        data: {
          playerOneMatch: {
            create: [
              {
                gameId: this.gameRoomId,
                p1s: this.p1s,
                p2s: this.p2s,
                playerTwoId: this.p2id,
              },
            ],
          },
        },
      });
    }

    const newElos = await this.getNewElos(prismaService, this.p1s >= 10);
    if (newElos && this.p1id && this.p2id) {
      await this.updateUserElo(this.p1id, newElos.eloPlayer1, prismaService);
      await this.updateUserElo(this.p2id, newElos.eloPlayer2, prismaService);
    }
  }
}

export enum Status {
  PLAYING = 'PLAYING',
  DONE = 'DONE',
  OVER = 'OVER',
  PAUSED = 'PAUSED',
  PENDING = 'PENDING',
}
