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
  twoFactorAuthenticationSet?: boolean;
  twoFactorAuthenticationSecret?: string;
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
