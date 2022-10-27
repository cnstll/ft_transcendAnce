import { Injectable } from '@nestjs/common';
import { PositionDto } from './dto/position.dto';
import { Position, GameCoords, Players } from './entities/position.entity';

@Injectable()
export class GameService {
  // messages: Position[] = [{ x: 100, y: 100 }];

  GameMap = new Map<string, GameCoords>();

  dirx: number = 0.5;
  diry: number = 0.0;

  clientToUser = {};

  create(createMessageDto: PositionDto) {
    const game: GameCoords = this.GameMap.get(createMessageDto.room);
    if (createMessageDto.player == 1) {
      game['p1x'] = createMessageDto.x;
      game['p1y'] = createMessageDto.y;
    }
    else {
      game['p2x'] = createMessageDto.x;
      game['p2y'] = createMessageDto.y;
    }
    return game;
  }

  // moveBall() {
  //   if (this.Game.by >= 100) {
  //     this.diry = this.diry * -1;
  //   }
  //   if (this.Game.by <= 0) {
  //     this.diry = this.diry * -1;
  //   }
  //   if (this.Game.bx <= 5 && this.Game.bx >= 3) {
  //     if (this.Game.by >= this.Game.p1y && this.Game.by <= this.Game.p1y + 10) {
  //       if (this.dirx > 0) {
  //         this.dirx = 5;
  //       }
  //       else {
  //         this.dirx = this.dirx * -1 + 0.05;
  //       }
  //       this.diry = ((this.Game.by - this.Game.p1y) - 5) / 10;
  //     }
  //   }
  //   if (this.Game.bx >= 95 && this.Game.bx <= 97) {
  //     if (this.Game.by >= this.Game.p2y && this.Game.by <= this.Game.p2y + 10) {
  //       // this.dirx = -0.5;
  //       this.dirx = this.dirx * -1 - 0.05;
  //       this.diry = ((this.Game.by - this.Game.p2y) - 5) / 10;
  //     }
  //   }
  //   if (this.Game.bx < 0) {
  //     this.Game.p2s += 1;
  //     this.dirx = 0.5
  //   }
  //   if (this.Game.bx > 100) {
  //     this.Game.p1s += 1;
  //     this.dirx = -0.5
  //   }
  //   this.Game.bx += this.dirx;
  //   this.Game.by += this.diry;
  //   return this.Game;
  // }

  moveBall(roomName: string) {
    const game: GameCoords = this.GameMap.get(roomName);

    if (game['by'] >= 100) {
      this.diry = this.diry * -1;
    }
    if (game['by'] <= 0) {
      this.diry = this.diry * -1;
    }
    if (game['bx'] <= 5 && game['bx'] >= 3) {
      if (game['by'] >= game['p1y'] && game['by'] <= game['p1y'] + 10) {
        if (this.dirx > 0) {
          this.dirx = 5;
        }
        else {
          this.dirx = this.dirx * -1 + 0.05;
        }
        this.diry = ((game['by'] - game['p1y']) - 5) / 10;
      }
    }
    if (game['bx'] >= 95 && game['bx'] <= 97) {
      if (game['by'] >= game['p2y'] && game['by'] <= game['p2y'] + 10) {
        this.dirx = this.dirx * -1 - 0.05;
        this.diry = ((game['by'] - game['p2y']) - 5) / 10;
      }
    }
    if (game['bx'] < 0) {
      game['p2s'] += 1;
      this.dirx = 0.5
    }
    if (game['bx'] > 100) {
      game['p1s'] += 1;
      this.dirx = -0.5
    }
    game['bx'] += this.dirx;
    game['by'] += this.diry;
    return game;
  }

  createGame(roomName: string) {
    let game: GameCoords = {
      gameRoom: null,
      p1x: 50,
      p1y: 50,
      p2x: 50,
      p2y: 50,
      bx: 50,
      by: 10,
      p1s: 0,
      p2s: 0,
    }
    this.GameMap.set(roomName, game);
  }

  deleteGame(roomName: string) {
    this.GameMap.delete(roomName);
  }

  identify(name: string, clientId: string) {
    this.clientToUser[clientId] = name;
    return Object.values(this.clientToUser);
  }

  getClientName(clientId: string) {
    return this.clientToUser[clientId];
  }

  findAll() {
    // return this.messages;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
