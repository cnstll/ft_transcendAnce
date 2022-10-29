export interface CreateRoomDto {
  roomId: string;
  roomName: string;
  creatorName: string;
  creatorId: string;
}

export interface JoinRoomDto {
  userName: string;
  userId: string;
  roomId: string;
}
