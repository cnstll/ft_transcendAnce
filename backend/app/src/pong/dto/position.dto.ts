import { Position } from '../entities/game.entities';

export interface PositionDto extends Position {
  room: string;
  player: number;
}
