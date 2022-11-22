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
import { JoinChannelDto } from './dto/joinChannel.dto';
import { LeaveChannelDto } from './dto/leaveChannel.dto';
import { IncomingMessageDto } from './dto/incomingMessage.dto';

enum acknoledgementStatus {
  OK = 'OK',
  FAILED = 'FAILED',
}

@WebSocketGateway(3333, {
  cors: {
    origin: [
      process.env.FRONTEND_URL,
      process.env.BACKEND_URL,
      process.env.DOMAIN,
      process.env.PUBLIC_URL,
    ],
    credentials: true,
  },
  parser: require('socket.io-msgpack-parser'),
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
    const joinedRoom = await this.channelService.joinChannelWS(
      dto,
      userId,
      clientSocket,
    );
    typeof joinedRoom === 'string'
      ? this.server.to(clientSocket.id).emit('joinRoomPWDFailed', joinedRoom)
      : typeof joinedRoom === null
      ? this.server.to(clientSocket.id).emit('joinRoomFailed')
      : this.server
          .to(dto.id)
          .emit('roomJoined', { userId: userId, channelId: joinedRoom.id });
  }

  //   When a user send a message in a channel, all the users within the room receive the message
  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('messageRoom')
  async sendMessage(
    @GetCurrentUserId() senderId: string,
    @MessageBody('messageInfo') messageInfo: IncomingMessageDto,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    // console.log(messageInfo);
    // const sockets = await this.server.fetchSockets();
    // for (const s of sockets) {
    //   console.log('id: ', s.id, 'rooms: ', s.rooms, 'data: ', s.data);
    // }
    const messageSaved = await this.channelService.storeMessage(
      senderId,
      messageInfo,
    );
    // console.log('messageSaved: ', messageSaved);

    if (messageSaved === null) {
      this.server.to(clientSocket.id).emit('messageRoomFailed');
      return acknoledgementStatus.FAILED;
    } else {
      clientSocket
        .to(messageInfo.channelId)
        .emit('incomingMessage', messageInfo.content);
      return acknoledgementStatus.OK;
    }
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
    roomEdited === null || typeof roomEdited === 'string'
      ? this.server.to(clientSocket.id).emit('editRoomFailed', roomEdited)
      : this.server
          .to([clientSocket.id, channelId])
          .emit('roomEdited', channelId);
  }

  //Delete channel
  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('leaveRoom')
  async deleteRoom(
    @GetCurrentUserId() userId: string,
    @MessageBody('leaveInfo') leaveChannelDto: LeaveChannelDto,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    // console.log(clientSocket.rooms, leaveChannelDto, clientSocket.id);
    const userLeaving = await this.channelService.leaveChannelWS(
      userId,
      leaveChannelDto,
    );
    if (userLeaving == null) {
      this.server.to(clientSocket.id).emit('leaveRoomFailed');
    } else {
      this.server
        .to(leaveChannelDto.id)
        .emit('roomLeft', { userId: userId, channelId: leaveChannelDto.id });
      clientSocket.leave(leaveChannelDto.id);
    }
  }
}
