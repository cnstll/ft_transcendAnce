import { Position } from '../entities/position.entity';

export interface PositionDto extends Position {
  room: string;
  player: number;
}
