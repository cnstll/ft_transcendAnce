import { channel } from "diagnostics_channel";

export class Position {
  x: number;
  y: number;
}

export class GameCoords {
  gameRoom: string;
  dirx: number;
  diry: number;
  p1x: number;
  p1y: number;
  p2x: number;
  p2y: number;
  bx: number;
  by: number;
  p1s: number;
  p2s: number;
  paddleSize: number;
}

export class Players {
  p1: string;
  p2: string;
}

export class gameRoom extends Players {
  p1: string;
  p2: string;
  roomName: string;
}
export type roomMapType = {
  [id: string]: Players;
}
