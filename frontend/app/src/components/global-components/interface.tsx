export interface Channel {
  id: string;
  name: string;
  type: 'PUBLIC' | 'PRIVATE' | 'PROTECTED' | 'DIRECTMESSAGE';
}

export interface User {
  id: string;
  avatarImg: string;
  nickname: string;
  eloScore: number;
  status: 'OFFLINE' | 'ONLINE' | 'PLAYING';
}

export interface MatchData {
  numberOfWin: number;
  numberOfLoss: number;
  ranking: number;
}
