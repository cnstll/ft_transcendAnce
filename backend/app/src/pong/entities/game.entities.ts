import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

export interface Position {
  x: number;
  y: number;
}

export interface HandshakeRequest extends Request {
  handshake?: { headers: { cookie: string } };
}

export enum GameMode {
  CLASSIC = 'CLASSIC',
  MAYHEM = 'MAYHEM',
  HOCKEY = 'HOCKEY',
}
const genrateRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
export class Game {
  constructor(mode: GameMode) {
    this.gameRoomId = this.makeid(5);
    this.mode = mode;
    if (this.mode === GameMode.MAYHEM) {
      this.color = 'red';
    }
  }

  gameRoomId: string;
  p1id: string = null;
  p2id: string = null;
  status: Status;
  dirx = 0.3;
  diry = 0.0;
  p1x = 5;
  p1y = 50;
  p2x = 95;
  p2y = 50;
  bx = 50;
  by = 55;
  p1s = 0;
  p2s = 0;
  paddleSize = 10;
  mode: GameMode = GameMode.CLASSIC;
  color = 'black';

  moveBall() {
    if (this.by >= 100) {
      this.diry = this.diry * -1;
    }
    if (this['by'] <= 0) {
      this.diry = this.diry * -1;
    }
    if (this['bx'] <= 7 && this['bx'] >= 3) {
      if (this['by'] >= this['p1y'] && this['by'] <= this['p1y'] + 10) {
        switch (this.mode) {
          case GameMode.MAYHEM: {
            if (this.dirx > 0) {
              this.dirx = 5;
            } else {
              this.dirx = this.dirx * -1;
              if (this.dirx < 3) {
                this.dirx += 0.05;
              }
            }
            break;
          }
          case GameMode.CLASSIC: {
            this.dirx = this.dirx * -1;
            if (this.dirx < 3) {
              this.dirx += 0.05;
            }
            break;
          }
        }
        this.diry = (this['by'] - this['p1y'] - 5) / 10;
      }
    }
    if (this['bx'] >= 93 && this['bx'] <= 97) {
      if (this['by'] >= this['p2y'] && this['by'] <= this['p2y'] + 10) {
        switch (this.mode) {
          case GameMode.MAYHEM: {
            if (this.dirx < 0) {
              this.dirx = -5;
            } else {
              this.dirx = this.dirx * -1;
              if (this.dirx > -3) {
                this.dirx -= 0.05;
              }
            }
            break;
          }
          case GameMode.CLASSIC: {
            this.dirx = this.dirx * -1;
            if (this.dirx > -2) {
              this.dirx -= 0.05;
            }
            break;
          }
        }
        this.diry = (this['by'] - this['p2y'] - 5) / 10;
      }
    }
    if (this['bx'] <= 0) {
      switch (this.mode) {
        case GameMode.CLASSIC: {
          // this.bx = 0;
          this.p2s += 1;
          this.dirx = 0.2;
          this.bx = 50;
          this.diry = genrateRandomNumber(-10, 10) / 20;
          break;
        }

        case GameMode.MAYHEM: {
          this.bx = 0;
          this.p2s += 1;
          this.dirx = 0.5;
          break;
        }
      }
    }
    if (this['bx'] > 100) {
      switch (this.mode) {
        case GameMode.CLASSIC: {
          this.p1s += 1;
          this.dirx = -0.2;
          this.bx = 50;
          this.diry = genrateRandomNumber(-10, 10) / 20;
          break;
        }

        case GameMode.MAYHEM: {
          this.bx = 0;
          this.p1s += 1;
          this.dirx = 0.2;
          break;
        }
      }
      // this.bx = 100;
      // this.p1s += 1;
      // this.dirx = -0.5;
    }
    this['bx'] += this.dirx;
    this['by'] += this.diry;
    return this;
  }

  claimVictory(winnerId: string, prismaService: PrismaService) {
    if (this.p1id == winnerId) {
      this.p1s = 10;
    } else {
      this.p2s = 10;
    }
    this.saveGameResults(prismaService);
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
    if (player == 1) {
      this.p1y = pos;
    } else {
      this.p2y = pos;
    }
  }

  returnGameInfo() {
    return {
      dirx: this.dirx,
      diry: this.diry,
      p1x: this.p1x,
      p1y: this.p1y,
      p2x: this.p2x,
      p2y: this.p2y,
      bx: this.bx,
      by: this.by,
      p1s: this.p1s,
      p2s: this.p2s,
      paddleSize: this.paddleSize,
      gameRoomId: this.gameRoomId,
      color: this.color,
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
      return user.eloScore;
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
    const eloPlayer1 = await this.getUserElo(this.p1id, prismaService);
    const eloPlayer2 = await this.getUserElo(this.p2id, prismaService);

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

  async saveGameResults(prismaService: PrismaService) {
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

    const newElos = await this.getNewElos(prismaService, this.p1s >= 10);
    this.updateUserElo(this.p1id, newElos.eloPlayer1, prismaService);
    this.updateUserElo(this.p2id, newElos.eloPlayer2, prismaService);
  }
}

export interface Players {
  p1: string;
  p2: string;
}

export enum Status {
  PLAYING = 'PLAYING',
  DONE = 'DONE',
  PAUSED = 'PAUSED',
  PENDING = 'PENDING',
}

export interface GameRoom extends Players {
  p1: string;
  p2: string;
  roomName: string;
  status: Status;
}

export type roomMapType = {
  [id: string]: Players;
};
