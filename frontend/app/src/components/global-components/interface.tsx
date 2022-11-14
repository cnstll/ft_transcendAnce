export enum channelType {
  Public = 'PUBLIC',
  Private = 'PRIVATE',
  Protected = 'PROTECTED',
  DirectMessage = 'DIRECTMESSAGE',
}
 
export const apiUrl: string = (process.env.REACT_APP_BACKEND_URL === undefined?  'oops': process.env.REACT_APP_BACKEND_URL);
export const domain: string = (process.env.REACT_APP_DOMAIN=== undefined?  'oops': process.env.REACT_APP_DOMAIN);

export interface Channel {
  id: string;
  name: string;
  passwordHash?: string;
  type: channelType;
}

export enum friendshipStatus {
  REQUSTED,
  ACCEPTED,
  PENDING,
  ADD,
}

export interface User {
  id: string;
  avatarImg: string;
  nickname: string;
  eloScore: number;
  status: 'OFFLINE' | 'ONLINE' | 'PLAYING';
  twoFactorAuthenticationSet: boolean;
  twoFactorAuthenticationSecret: string;
}

export interface RankingData {
  id: string;
  nickname: string;
  avatarImg: string;
  eloScore: number;
}

export interface Stats {
  numberOfWin: number;
  numberOfLoss: number;
  ranking: string;
  eloScore: number;
}

export interface MatchData {
  id: string;
  imageCurrentUser: string;
  imageOpponent: string;
  score: string;
  matchWon: boolean;
}

export interface TargetInfo {
  id: string;
  nickname: string;
  avatarImg: string;
  eloScore: number;
  status: string;
  friendStatus?: string;
}

export enum GameStatus {
  PLAYING = 'PLAYING',
  DONE = 'DONE',
  PENDING = 'PENDING',
  PAUSED = 'PAUSED',
}

export interface GameCoords {
  // p1x: number;
  p1y: number;
  // p2x: number;
  p2y: number;
  bx: number;
  by: number;
  p1s: number;
  p2s: number;
  paddleSize: number;
}
