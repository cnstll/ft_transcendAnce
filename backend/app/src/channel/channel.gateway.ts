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
import {
  CreateChannelDto,
  EditChannelDto,
  EditRoleChannelDto,
  JoinChannelDto,
  LeaveChannelDto,
  InviteChannelDto,
  IncomingMessageDto,
} from './dto';
import { Channel, ChannelRole, ChannelType } from '@prisma/client';
import { socketToUserId } from 'src/user/socketToUserIdStorage.service';
import { ModerateChannelDto } from './dto/moderateChannelUser.dto';
import * as msgpack from 'socket.io-msgpack-parser';

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
  parser: msgpack,
})
@UseGuards(JwtAuthGuard)
export class ChannelGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly channelService: ChannelService) {}

  @SubscribeMessage('connectToRoom')
  async connectToChannel(
    @GetCurrentUserId() userId: string,
    @MessageBody('channelId') channelId: string,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    const userOnChannel = await this.channelService.connectToChannel(
      userId,
      channelId,
      clientSocket,
    );
    userOnChannel === null
      ? this.server.to(clientSocket.id).emit('connectionFailed')
      : this.server.emit('connectedToRoom', channelId);
  }

  //When a user send create a channel, a room is created in backend with a name and id and the user gets admin role
  @SubscribeMessage('createRoom')
  async createChannel(
    @GetCurrentUserId() userId: string,
    @MessageBody('createInfo') dto: CreateChannelDto,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    dto = {
      ...dto,
    };
    let channel: Channel | string | null;
    if (dto.type === ChannelType.DIRECTMESSAGE) {
      channel = await this.channelService.createDirectMessageWS(
        dto,
        userId,
        clientSocket,
      );
      /** Get the second user's socketId and make it join the channel's room */
      if (typeof dto.userId === 'string') {
        const secondUserSocket = socketToUserId.getFromUserId(dto.userId);
        if (secondUserSocket && channel && typeof channel !== 'string')
          this.server.in([secondUserSocket]).socketsJoin(channel.id);
      }
    } else {
      channel = await this.channelService.createChannelWS(
        dto,
        userId,
        clientSocket,
      );
    }
    typeof channel === 'string' || !channel
      ? this.server.to(clientSocket.id).emit('createRoomFailed', channel)
      : this.server.emit('roomCreated', channel.id, userId);
  }

  // When a user join a channel, her ids are added to the users in the corresponding room
  @SubscribeMessage('joinRoom')
  async joinChannel(
    @GetCurrentUserId() userId: string,
    @MessageBody('joinInfo') dto: JoinChannelDto,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    // Change UserId depending if the channel is of type direct message
    const joinedRoom = await this.channelService.joinChannelWS(
      dto,
      userId,
      clientSocket,
    );
    typeof joinedRoom === 'string'
      ? this.server.to(clientSocket.id).emit('joinRoomError', joinedRoom)
      : joinedRoom
      ? this.server
          .to(dto.id)
          .emit('roomJoined', { userId: userId, channelId: joinedRoom.id })
      : this.server.to(clientSocket.id).emit('joinRoomFailed');
  }

  //   When a user send a message in a channel, all the users within the room receive the message
  @SubscribeMessage('messageRoom')
  async sendMessage(
    @GetCurrentUserId() senderId: string,
    @MessageBody('messageInfo') messageInfo: IncomingMessageDto,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    const messageSaved = await this.channelService.storeMessage(
      senderId,
      messageInfo,
    );

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
  @SubscribeMessage('leaveRoom')
  async deleteRoom(
    @GetCurrentUserId() userId: string,
    @MessageBody('leaveInfo') leaveChannelDto: LeaveChannelDto,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    const userLeaving = await this.channelService.leaveChannelWS(
      userId,
      leaveChannelDto,
    );
    if (!userLeaving || typeof userLeaving === 'string') {
      this.server.to(clientSocket.id).emit('leaveRoomFailed');
    } else if (leaveChannelDto.type === ChannelType.DIRECTMESSAGE) {
      this.server.to(leaveChannelDto.id).emit('roomLeft', {
        userId: userId,
        channelId: leaveChannelDto.id,
        secondUserId: userLeaving.userId,
      });
      /** Get the first user's socketId to leave the channel's room */
      await clientSocket.leave(leaveChannelDto.id);
      /** Get the second user's socketId to leave the channel's room */
      if (typeof userLeaving !== 'string') {
        const secondUserSocket = socketToUserId.getFromUserId(
          userLeaving.userId,
        );
        if (secondUserSocket && typeof userLeaving !== 'string')
          this.server.in(secondUserSocket).socketsLeave(userLeaving.channelId);
      }
    } else {
      this.server
        .to(leaveChannelDto.id)
        .emit('roomLeft', { userId: userId, channelId: leaveChannelDto.id });
      await clientSocket.leave(leaveChannelDto.id);
    }
  }

  // Invite other users to a private channel
  @SubscribeMessage('inviteToChannel')
  async inviteToChannel(
    @GetCurrentUserId() userId: string,
    @MessageBody('inviteInfo') inviteChannelDto: InviteChannelDto,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    const inviteToChannel = await this.channelService.inviteToChannelWS(
      userId,
      inviteChannelDto,
    );
    if (!inviteToChannel || typeof inviteToChannel === 'string') {
      this.server.to(clientSocket.id).emit('inviteFailed', inviteToChannel);
    } else {
      this.server
        .to([clientSocket.id, inviteChannelDto.channelId])
        .emit('inviteSucceeded', inviteToChannel);
    }
  }

  @SubscribeMessage('banUser')
  async banUserFromChannel(
    @GetCurrentUserId() requesterId: string,
    @MessageBody('banInfo') banInfo: ModerateChannelDto,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    const banResult = await this.channelService.banFromChannelWS(
      requesterId,
      banInfo,
    );
    if (!banResult || typeof banResult === 'string') {
      this.server.to(clientSocket.id).emit('banFailed', banResult);
    } else {
      this.server
        .to(banInfo.channelActionOnChannelId)
        .emit('banSucceeded', banResult);
    }
  }

  @SubscribeMessage('muteUser')
  async muteUserFromChannel(
    @GetCurrentUserId() requesterId: string,
    @MessageBody('muteInfo') muteInfo: ModerateChannelDto,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    const muteResult = await this.channelService.muteFromChannelWS(
      requesterId,
      muteInfo,
    );
    if (!muteResult || typeof muteResult === 'string') {
      this.server.to(clientSocket.id).emit('muteFailed', muteResult);
    } else {
      this.server
        .to(muteInfo.channelActionOnChannelId)
        .emit('muteSucceeded', muteResult);
    }
  }

  @SubscribeMessage('updateRole')
  async editRole(
    @GetCurrentUserId() userId: string,
    @MessageBody('channelId') channelId: string,
    @MessageBody('targetInfo') editRoleDto: EditRoleChannelDto,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    const roleUpdated = await this.channelService.updateAdminRoleByChannelIdWS(
      userId,
      channelId,
      editRoleDto,
    );
    roleUpdated === ChannelRole.ADMIN ||
    roleUpdated === ChannelRole.OWNER ||
    roleUpdated === ChannelRole.USER
      ? this.server.in(channelId).emit('roleUpdated', roleUpdated)
      : this.server.to(clientSocket.id).emit('updateRoleFailed', roleUpdated);
  }
}
