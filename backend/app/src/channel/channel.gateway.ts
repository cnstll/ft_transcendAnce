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
import { CreateChannelDto, EditChannelDto } from './dto';
import { UserMessageDto } from './dto/userMessage.dto';
import { JoinChannelDto } from './dto/joinChannel.dto';
import { LeaveChannelDto } from './dto/leaveChannel.dto';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:8080',
    credentials: true,
  },
})
export class ChannelGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly channelService: ChannelService) {}

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('connectToRoom')
  async connectToChannel(
    @GetCurrentUserId() userId: string,
    @MessageBody('channelId') channelId: string,
    @MessageBody('channelPassword') channelPassword: string,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    const channel = await this.channelService.connectToChannel(
      userId,
      channelId,
      channelPassword,
      clientSocket,
    );
    channel === null
      ? this.server.to(clientSocket.id).emit('connectionFailed')
      : this.server.emit('connectedToRoom', channelId);
  }

  //When a user send create a channel, a room is created in backend with a name and id and the user gets admin role
  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('createRoom')
  async createChannel(
    @GetCurrentUserId() userId: string,
    @MessageBody('createInfo') dto: CreateChannelDto,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    dto = {
      ...dto,
    };
    const channel = await this.channelService.createChannelWS(
      dto,
      userId,
      clientSocket,
    );
    channel === null || typeof channel === 'string'
      ? this.server.to(clientSocket.id).emit('createRoomFailed', channel)
      : this.server.emit('roomCreated', channel.id);
  }

  // When a user join a channel, her ids are added to the users in the corresponding room
  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('joinRoom')
  async joinChannel(
    @GetCurrentUserId() userId: string,
    @MessageBody('joinInfo') dto: JoinChannelDto,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    console.log('JOINING: ', userId);
    const joinedRoom = await this.channelService.joinChannelWS(
      dto,
      userId,
      clientSocket,
    );
    joinedRoom == null
      ? this.server.to(clientSocket.id).emit('joinRoomFailed')
      : this.server.to(dto.id).emit('roomJoined', joinedRoom);
  }

  //   When a user send a message in a channel, all the users within the room receive the message
  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('messageRoom')
  async sendMessage(
    @GetCurrentUserId() senderId: string,
    @MessageBody('channelId') channelId: string,
    @MessageBody('content') content: string,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    const message: UserMessageDto = {
      content: content,
      senderId: senderId,
    };
    const messageSaved = await this.channelService.storeMessage(
      message,
      channelId,
    );
    messageSaved == null
      ? this.server.to(clientSocket.id).emit('messageRoomFailed')
      : clientSocket.to(channelId).emit('incomingMessage', message);
  }

  // When a user is typing in a channel, a 'someone is typing' should be displayed to other users in the room
  @SubscribeMessage('typing')
  someoneIsTyping(
    @MessageBody('roomId') roomId: string,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    return clientSocket.to(roomId).emit('typing');
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('editRoom')
  async editRoom(
    @GetCurrentUserId() userId: string,
    @MessageBody('channelId') channelId: string,
    @MessageBody('editInfo') editChannelDto: EditChannelDto,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    const roomEdited = await this.channelService.editChannelByIdWS(
      userId,
      channelId,
      editChannelDto,
    );
    roomEdited == null
      ? this.server.to(clientSocket.id).emit('editRoomFailed')
      // used as an array of sockets to emit to, to be tested if other users of the channel get the update
      : this.server.to([clientSocket.id, channelId]).emit('roomEdited', channelId);
  }

  //Delete channel
  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('leaveRoom')
  async deleteRoom(
    @GetCurrentUserId() userId: string,
    @MessageBody('leaveInfo') leaveChannelDto: LeaveChannelDto,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    console.log(clientSocket.rooms, leaveChannelDto, clientSocket.id);
    const userLeaving = await this.channelService.leaveChannelWS(
      userId,
      leaveChannelDto,
    );
    if (userLeaving == null) {
      this.server.to(clientSocket.id).emit('leaveRoomFailed');
    } else {
      this.server.emit('roomLeft', userLeaving);
    }
  }
}
