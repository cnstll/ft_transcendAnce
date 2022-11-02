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
import { DeleteChannelDto } from './dto/deleteChannel.dto';

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
    const channelId =
      new Date().getTime() + Math.random().toString(10).slice(12);
    dto = {
      id: channelId,
      ...dto,
    };
    const channel = await this.channelService.createChannelWS(
      dto,
      userId,
      clientSocket,
    );
    channel === null
      ? this.server.to(clientSocket.id).emit('createRoomFailed')
      : this.server.emit('roomCreated', channelId);
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
      : this.server.to(channelId).emit('roomEdited', channelId);
  }

  //Delete channel
  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('deleteRoom')
  async deleteRoom(
    @GetCurrentUserId() userId: string,
    @MessageBody('deleteInfo') deleteChannelDto: DeleteChannelDto,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    console.log(clientSocket.rooms, deleteChannelDto, clientSocket.id);
    const roomDeleted = await this.channelService.deleteChannelWS(
      userId,
      deleteChannelDto,
    );
    roomDeleted == null
      ? this.server.to(clientSocket.id).emit('deleteRoomFailed')
      : this.server.emit('roomDeleted', roomDeleted);
  }
}
