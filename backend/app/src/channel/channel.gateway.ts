import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChannelService } from './channel.service';
import { Server, Socket } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt.auth-guard';
import { GetCurrentUserId } from '../common/decorators/getCurrentUserId.decorator';
import { RoomData, UserMessage } from './channel.interface';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost',
    credentials: true,
  },
})
export class ChannelGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly channelService: ChannelService) {}

  @SubscribeMessage('getRoomById')
  getRoomById(
    @MessageBody('roomId') roomId: string,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    const fetchedRoom = this.channelService.getRoomById(roomId);
    this.server.to(clientSocket.id).emit('getRoomById', fetchedRoom);
  }
  //When a user send create a channel, a room is created in backend with a name and id and the user gets admin role
  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('createRoom')
  createRoom(
    @GetCurrentUserId() userId: string,
    @MessageBody('userName') userName: string,
    @MessageBody('roomName') roomName: string,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    // console.log('createRoom: ', userName, roomName);
    const roomId = new Date().getTime() + Math.random().toString(10).slice(12);
    const createRoomData: RoomData = {
      roomId: roomId,
      roomName: roomName,
      clientId: userId,
      clientName: userName,
    };
    this.channelService.createRoom(createRoomData, clientSocket) == null
      ? this.server.to(clientSocket.id).emit('createRoomFailed')
      : this.server.emit('roomCreated', roomId);
  }
  // When a user join a channel, her ids are added to the users in the corresponding room
  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('joinRoom')
  joinRoom(
    @GetCurrentUserId() userId: string,
    @MessageBody('userName') userName: string,
    @MessageBody('roomId') roomId: string,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    const joinRoomData: RoomData = {
      roomId: roomId,
      clientId: userId,
      clientName: userName,
    };
    const joinedRoom = this.channelService.joinRoom(joinRoomData, clientSocket);
    joinedRoom == null
      ? this.server.to(clientSocket.id).emit('joinRoomFailed')
      : this.server.emit('roomJoined', joinedRoom);
  }
  //   When a user send a message in a channel, all the users within the room receive the message
  @SubscribeMessage('messageRoom')
  handleMessage(
    @MessageBody('message') message: UserMessage,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    const messageSaved = this.channelService.storeMessage(message);
    messageSaved == null
      ? this.server.to(clientSocket.id).emit('messageRoomFailed')
      : clientSocket.to(message.toRoomId).emit('incomingMessage', message);
  }
  // When a user is typing in a channel, a 'someone is typing' should be displayed to other users in the room
  @SubscribeMessage('typing')
  someoneIsTyping(
    @MessageBody('roomId') roomId: string,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    return clientSocket.to(roomId).emit('typing');
  }

  //Delete channel
  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('deleteRoom')
  deleteRoom(
    @GetCurrentUserId() userId: string,
    @MessageBody('roomId') roomId: string,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    const roomDeleted = this.channelService.deleteRoom(userId, roomId);
    roomDeleted == null
      ? this.server.to(clientSocket.id).emit('deleteRoomFailed')
      : this.server.to(roomId).emit('roomDeleted', roomId);
  }
}
