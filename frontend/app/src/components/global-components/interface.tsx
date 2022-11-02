export interface Channel {
  id: string;
  name: string;
  type: 'PUBLIC' | 'PRIVATE' | 'PROTECTED' | 'DIRECTMESSAGE';
}

export interface User {
  id: string;
  avatarImg: string;
  nickname: string;
  eloScore?: number;
  status: 'OFFLINE' | 'ONLINE' | 'PLAYING';
}

export interface UserData {
  id?: string;
  nickName: string;
  avatarImg: string;
}

export interface MatchData {
  numberOfWin: number;
  numberOfLoss: number;
  ranking: number;
}

export interface TargetInfo {
  id: string;
  nickname: string;
  avatarImg: string;
  eloScore: number;
  status: string;
  friendStatus: string;
}

export enum GameStatus {
  PLAYING = 'PLAYING',
  DONE = "DONE",
  PENDING = "PENDING"
}

export interface GameCoords {
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
