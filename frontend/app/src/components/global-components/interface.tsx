export interface Channel {
  id: string;
  name: string;
  type: 'PUBLIC' | 'PRIVATE' | 'PROTECTED' | 'DIRECTMESSAGE';
}

export interface User {
    id: string;
    image: string;
    nickname: string;
    status: 'OFFLINE' | 'ONLINE' | 'PLAYING';
  }