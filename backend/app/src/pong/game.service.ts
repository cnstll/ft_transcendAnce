import { Injectable } from '@nestjs/common';
import { PositionDto } from './dto/position.dto';
import { Position } from './entities/position.entity';

@Injectable()
export class GameService {
  messages: Position[] = [{ x: 100, y: 100 }];
  clientToUser = {};
  create(createMessageDto: PositionDto) {
    const message = { ...createMessageDto };
    // this.messages.push(createMessageDto);
    return message;
  }

  identify(name: string, clientId: string) {
    this.clientToUser[clientId] = name;
    return Object.values(this.clientToUser);
  }

  getClientName(clientId: string) {
    return this.clientToUser[clientId];
  }

  findAll() {
    return this.messages;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
