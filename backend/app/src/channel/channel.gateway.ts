import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChannelService } from './channel.service';
import { Server, Socket } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import { CreateRoomDto, JoinRoomDto } from './dto/createRoom.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
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
    clientSocket.emit('getRoomById', fetchedRoom);
  }
  //   When a user send create a channel, a room is created in backend with a name and id and the user gets admin role
  @SubscribeMessage('createRoom')
  createRoom(
    @MessageBody('userName') userName: string,
    @MessageBody('roomName') roomName: string,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    // console.log('createRoom: ', userName, roomName);
    const roomId = new Date().getTime() + Math.random().toString(10).slice(12);
    const createRoomDto: CreateRoomDto = {
      roomId: roomId,
      roomName: roomName,
      creatorName: userName,
      creatorId: userName,
    };
    console.log(createRoomDto);
    this.channelService.createRoom(createRoomDto, clientSocket) == null
      ? this.server.emit('createRoomFailed', roomId)
      : this.server.emit('roomCreated', roomId);
  }
  // When a user join a channel, her ids are added to the users in the corresponding room
  @SubscribeMessage('joinRoom')
  joinRoom(
    @MessageBody() joinRoomDto: JoinRoomDto,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    console.log(joinRoomDto);
    const joinedRoom = this.channelService.joinRoom(joinRoomDto, clientSocket);
    joinedRoom == null
      ? this.server.emit('joinRoomFailed', joinRoomDto)
      : this.server.emit('roomJoined', joinedRoom);
  }
  // When a user send a message in a channel, all the users within the room receive the message
  // When a user is typing in a channel, a 'someone is typing' should be displayed to other users in the room
}
