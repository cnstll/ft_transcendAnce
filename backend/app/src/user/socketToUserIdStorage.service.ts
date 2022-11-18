export class SocketToUserIdStorage {
  socketToUserId = new Map<string, string>();

  get(socketId: string) {
    return this.socketToUserId.get(socketId);
  }
  set(socketId: string, userId: string) {
    this.socketToUserId.set(socketId, userId);
  }
  delete(socketId: string) {
    this.socketToUserId.delete(socketId);
  }
}
