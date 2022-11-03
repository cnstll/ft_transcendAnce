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
    };
  }

  computeElo(RA: number, RB: number) {
    const exponent = (RB - RA) / 400;
    const intermediary = Math.pow(10, exponent);
    const newElo: number = 1 / (1 + intermediary);
    return newElo;
  }

  // Winner is a boolean set to 1 if player 1 won, and zero if he lost
  getNewElos(eloPlayer1: number, eloPlayer2: number, winner: boolean) {
    const newElos: { eloPlayer1: number; eloPlayer2: number } = {
      eloPlayer1: 0,
      eloPlayer2: 0,
    };

    console.log('these are the og ', eloPlayer1, eloPlayer2);
    const expectedElo1 = this.computeElo(eloPlayer1, eloPlayer2);
    const expectedElo2 = this.computeElo(eloPlayer2, eloPlayer1);

    if (winner) {
      newElos.eloPlayer1 = Math.ceil(eloPlayer1 + 15 * (1 - expectedElo1));
      newElos.eloPlayer2 = Math.ceil(eloPlayer2 + 15 * (0 - expectedElo2));
    } else {
      newElos.eloPlayer1 = Math.ceil(eloPlayer1 + 15 * (0 - expectedElo1));
      newElos.eloPlayer2 = Math.ceil(eloPlayer2 + 15 * (1 - expectedElo2));
    }
    return newElos;
  }

  async saveGameResults(prismaService: PrismaService) {
    // let newElos: { eloPlayer1: number; eloPlayer2: number };
    // let eloPlayer1: number;
    // let eloPlayer2: number;
    let elo: { eloScore: number };

    try {
      elo = await prismaService.user.findUnique({
        where: {
          id: this.p1id,
        },
        select: {
          eloScore: true,
        },
      });
    } catch (error) {
      console.log(error);
      //TODO should this error be handled? should be excedingly rare
    }
    const eloPlayer1 = elo.eloScore;

    try {
      elo = await prismaService.user.findUnique({
        where: {
          id: this.p2id,
        },
        select: {
          eloScore: true,
        },
      });
    } catch (error) {
      console.log(error);
      //TODO should this error be handled? should be excedingly rare
    }
    const eloPlayer2 = elo.eloScore;

    const newElos = this.getNewElos(eloPlayer1, eloPlayer2, this.p1s >= 10);

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
        eloScore: newElos.eloPlayer1,
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
        eloScore: newElos.eloPlayer2,
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
