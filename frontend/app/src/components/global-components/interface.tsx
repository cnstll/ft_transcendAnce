export enum channelType {
  Public = 'PUBLIC',
  Private = 'PRIVATE',
  Protected = 'PROTECTED',
  DirectMessage = 'DIRECTMESSAGE',
}

export enum channelRole {
  User = 'USER',
  Admin = 'ADMIN',
  Owner = 'OWNER',
}

export interface Channel {
  id: string;
  name: string;
  passwordHash?: string;
  type: channelType;
}
export interface Message {
  id: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  senderId: string;
  channelId: string;
}
export enum AcknoledgementStatus {
  OK = 'OK',
  FAILED = 'FAILED',
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

export interface AchievementData {
  id: string;
  label: string;
  description: string;
  image: string;
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
  color: string;
  paddleSize: number;
}
