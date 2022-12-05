export enum channelType {
  Public = 'PUBLIC',
  Private = 'PRIVATE',
  Protected = 'PROTECTED',
  DirectMessage = 'DIRECTMESSAGE',
}

export const apiUrl: string =
  process.env.REACT_APP_BACKEND_URL === undefined
    ? 'oops'
    : process.env.REACT_APP_BACKEND_URL;
export const domain: string =
  process.env.REACT_APP_DOMAIN === undefined
    ? 'oops'
    : process.env.REACT_APP_DOMAIN;

export enum channelRole {
  User = 'USER',
  Admin = 'ADMIN',
  Owner = 'OWNER',
}
export enum channelActionType {
  Ban = 'BAN',
  Mute = 'MUTE',
}

export interface GameInformation {
  p1x: number;
  p2x: number;
  playerOneScore: number;
  playerTwoScore: number;
  gameCoordinates: GameCoords;
  ballWidth: number;
  heightScalar: number;
  widthScalar: number;
  paddleWidth: number;
  paddleHeight: number;
  canvas: HTMLCanvasElement | null;
  context: CanvasRenderingContext2D | null;
  cacheCanvas: OffscreenCanvas | null;
  fontSize: number;
  playerNumber: number;
}

export interface Channel {
  id: string;
  name: string;
  passwordHash?: string;
  userId?: string;
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

export enum UserListType {
  MEMBERS = 'MEMBERS',
  FRIENDS = 'FRIENDS',
}

export enum UserConnectionStatus {
  OFFLINE = 'OFFLINE',
  ONLINE = 'ONLINE',
  PLAYING = 'PLAYING',
}

export interface User {
  id: string;
  avatarImg: string;
  nickname: string;
  eloScore: number;
  status: UserConnectionStatus;
  twoFactorAuthenticationSet: boolean;
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
  OVER = 'OVER',
  PENDING = 'PENDING',
  PAUSED = 'PAUSED',
}

export interface GameCoords {
  p1y: number;
  p2y: number;
  bx: number;
  by: number;
  p1s: number;
  p2s: number;
}

export interface ModerationInfo {
  channelActionTargetId: string;
  channelActionOnChannelId: string;
}
