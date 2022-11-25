export class SocketToUserIdStorage {
  socketToUserId = new Map<string, string>();
  userIdToSocket = new Map<string, string>();

  get(socketId: string) {
    return this.socketToUserId.get(socketId);
  }

  getFromUserId(userId: string) {
    return this.userIdToSocket.get(userId);
  }

  set(socketId: string, userId: string) {
    this.socketToUserId.set(socketId, userId);
    this.userIdToSocket.set(userId, socketId);
  }

  delete(socketId: string) {
    const userId = this.socketToUserId.get(socketId);
    this.socketToUserId.delete(socketId);
    this.userIdToSocket.delete(userId);
  }
}

export const socketToUserId = new SocketToUserIdStorage();
