import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

export interface Position {
  x: number;
  y: number;
}

export interface HandshakeRequest extends Request {
  handshake?: { headers: { cookie: string } };
}

export class Game {
  constructor() {
    this.gameRoomId = this.makeid(5);
  }

  gameRoomId: string;
  p1id: string = null;
  p2id: string = null;
  status: Status;
  dirx = 0.5;
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

  moveBall() {
    if (this.by >= 100) {
      this.diry = this.diry * -1;
    }
    if (this['by'] <= 0) {
      this.diry = this.diry * -1;
    }
    if (this['bx'] <= 7 && this['bx'] >= 3) {
      if (this['by'] >= this['p1y'] && this['by'] <= this['p1y'] + 10) {
        if (this.dirx > 0) {
          this.dirx = 5;
        } else {
          this.dirx = this.dirx * -1 + 0.05;
        }
        this.diry = (this['by'] - this['p1y'] - 5) / 10;
      }
    }
    if (this['bx'] >= 93 && this['bx'] <= 97) {
      if (this['by'] >= this['p2y'] && this['by'] <= this['p2y'] + 10) {
        this.dirx = this.dirx * -1 - 0.05;
        this.diry = (this['by'] - this['p2y'] - 5) / 10;
      }
    }
    if (this['bx'] < 0) {
      this['p2s'] += 1;
      this.dirx = 0.5;
    }
    if (this['bx'] > 100) {
      this['p1s'] += 1;
      this.dirx = -0.5;
    }
    this['bx'] += this.dirx;
    this['by'] += this.diry;
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
    };
  }
  async saveGameResults(prismaService: PrismaService) {
    await prismaService.match.create({
      data: {
        id: this.gameRoomId,
      },
    });

    await prismaService.user.update({
      where: {
        id: this.p1id,
      },
      data: {
        playerOnMatches: {
          create: [
            {
              matchId: this.gameRoomId,
              score: { myself: this.p1s, opponent: this.p2s },
            },
          ],
        },
      },
    });

    await prismaService.user.update({
      where: {
        id: this.p2id,
      },
      data: {
        playerOnMatches: {
          create: [
            {
              matchId: this.gameRoomId,
              score: { myself: this.p2s, opponent: this.p1s },
            },
          ],
        },
      },
    });
  }
}

export interface Players {
  p1: string;
  p2: string;
}

export enum Status {
  PLAYING = 'PLAYING',
  DONE = 'DONE',
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
