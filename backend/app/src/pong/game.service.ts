import { Injectable } from '@nestjs/common';
import { PositionDto } from './dto/position.dto';
import { GameCoords } from './entities/position.entity';

@Injectable()
export class GameService {
  // messages: Position[] = [{ x: 100, y: 100 }];

  GameMap = new Map<string, GameCoords>();

  // dirx: number = 0.5;
  // diry: number = 0.0;

  clientToUser = {};

  create(createMessageDto: PositionDto) {
    const game: GameCoords = this.GameMap.get(createMessageDto.room);
    if (createMessageDto.player == 1) {
      // game['p1x'] = createMessageDto.x;
      game['p1y'] = createMessageDto.y;
    } else {
      // game['p2x'] = createMessageDto.x;
      game['p2y'] = createMessageDto.y;
    }
    return game;
  }

  moveBall(roomName: string) {
    const game: GameCoords = this.GameMap.get(roomName);

    if (game['by'] >= 100) {
      game.diry = game.diry * -1;
    }
    if (game['by'] <= 0) {
      game.diry = game.diry * -1;
    }
    if (game['bx'] <= 7 && game['bx'] >= 3) {
      if (game['by'] >= game['p1y'] && game['by'] <= game['p1y'] + 10) {
        if (game.dirx > 0) {
          game.dirx = 5;
        } else {
          game.dirx = game.dirx * -1 + 0.05;
        }
        game.diry = (game['by'] - game['p1y'] - 5) / 10;
      }
    }
    if (game['bx'] >= 93 && game['bx'] <= 97) {
      if (game['by'] >= game['p2y'] && game['by'] <= game['p2y'] + 10) {
        game.dirx = game.dirx * -1 - 0.05;
        game.diry = (game['by'] - game['p2y'] - 5) / 10;
      }
    }
    if (game['bx'] < 0) {
      game['p2s'] += 1;
      game.dirx = 0.5;
    }
    if (game['bx'] > 100) {
      game['p1s'] += 1;
      game.dirx = -0.5;
    }
    game['bx'] += game.dirx;
    game['by'] += game.diry;
    return game;
  }

  createGame(roomName: string) {
    const game: GameCoords = {
      gameRoom: null,
      dirx: 0.5,
      diry: 0.0,
      p1x: 5,
      p1y: 50,
      p2x: 95,
      p2y: 50,
      bx: 50,
      by: 55,
      p1s: 0,
      p2s: 0,
      paddleSize: 10,
    };
    this.GameMap.set(roomName, game);
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
