export interface Message {
  sender: string;
  content: string;
}

export interface User {
  id: string;
  socketId: string;
  nickname: string;
  role: string;
  isMuted: boolean;
}

export interface Room {
  name?: string;
  users: User[];
  messages?: Message[];
}
