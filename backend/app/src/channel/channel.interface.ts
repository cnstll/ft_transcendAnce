export interface UserMessage {
  sender: string;
  toRoomId: string;
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
  messages?: UserMessage[];
}

export interface RoomData {
  roomId: string;
  roomName?: string;
  clientName?: string;
  clientId: string;
}
