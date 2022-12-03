import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Channel,
  ChannelRole,
  ChannelType,
  ChannelUser,
  User,
  Message,
  ChannelActionType,
  ChannelAction,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChannelDto, EditChannelDto, EditRoleChannelDto } from './dto';
import { Socket } from 'socket.io';
import { JoinChannelDto } from './dto/joinChannel.dto';
import { LeaveChannelDto } from './dto/leaveChannel.dto';
import * as argon from 'argon2';
import { InviteChannelDto } from './dto/inviteChannel.dto';
import { IncomingMessageDto } from './dto/incomingMessage.dto';
import { Response } from 'express';
import { ModerateChannelDto } from './dto/moderateChannelUser.dto';
import { BlockService } from 'src/block/block.service';

@Injectable()
export class ChannelService {
  constructor(
    private prisma: PrismaService,
    private readonly blockService: BlockService,
  ) {}

  getChannels() {
    return this.prisma.channel.findMany();
  }

  getGroupChannels() {
    return this.prisma.channel.findMany({
      where: {
        OR: [{ type: 'PUBLIC' }, { type: 'PRIVATE' }, { type: 'PROTECTED' }],
      },
      select: {
        id: true,
        name: true,
        type: true,
      },
    });
  }

  async getAllChannelsByUserId(userId: string) {
    const channels = await this.prisma.channel.findMany({
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        type: true,
      },
    });
    /** Check if the channnel is of type DIRECT MESSAGE and change the name
     * according to the name of the current user
     */
    for (let i = 0; i < channels.length; i++) {
      if (channels[i].type === 'DIRECTMESSAGE') {
        const channelUser = await this.getUsersOfAChannel(channels[i].id);
        if (channelUser[0].id === userId && channelUser[1])
          channels[i].name = channelUser[1].nickname;
        else channels[i].name = channelUser[0].nickname;
      }
    }
    return channels;
  }

  getChannelById(channelId: string) {
    return this.prisma.channel.findFirst({
      where: {
        id: channelId,
      },
    });
  }

  getChannelByUserId(userId: string, channelId: string) {
    return this.prisma.channelUser.findUnique({
      where: {
        userId_channelId: {
          userId: userId,
          channelId: channelId,
        },
      },
      select: {
        channel: true,
      },
    });
  }

  async getDirectMessageByUserId(userId: string, participantId: string) {
    const allDirectMessages = await this.prisma.channel.findMany({
      where: {
        type: 'DIRECTMESSAGE',
      },
    });
    for (let i = 0; i < allDirectMessages.length; i++) {
      const users = await this.getUsersOfAChannel(allDirectMessages[i].id);
      if (
        (users.length > 1 &&
          users[0].id === userId &&
          users[1].id === participantId) ||
        (users[0].id === participantId && users[1].id === userId)
      )
        return allDirectMessages[i];
    }
    return null;
  }

  async getChannelAuthors(channelId: string) {
    try {
      const authors = await this.prisma.message.findMany({
        where: {
          channelId: channelId,
        },
        select: {
          sender: {
            select: {
              id: true,
              nickname: true,
              avatarImg: true,
            },
          },
        },
        distinct: ['senderId'],
      });
      const flattenAuthors = [];
      for (let index = 0; index < authors.length; index++) {
        flattenAuthors.push(authors[index].sender);
      }
      return flattenAuthors;
    } catch (error) {
      if (error.status === 404) throw new NotFoundException(error);
      else throw new ForbiddenException(error);
    }
  }

  async checkChannel(channelId: string) {
    const channel: Channel = await this.prisma.channel.findFirst({
      where: {
        id: channelId,
      },
    });
    if (channel === null) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  async getUsersOfAChannel(channelId: string) {
    try {
      await this.checkChannel(channelId);
      const users = await this.prisma.channelUser.findMany({
        where: {
          channelId: channelId,
        },
        select: {
          user: {
            select: {
              id: true,
              avatarImg: true,
              nickname: true,
              eloScore: true,
              status: true,
              twoFactorAuthenticationSet: true,
            },
          },
        },
      });
      const flattenUsers = [];
      for (let index = 0; index < users.length; index++) {
        flattenUsers.push(users[index].user);
      }
      return flattenUsers;
    } catch (error) {
      if (error.status === 404) throw new NotFoundException(error);
      else throw new ForbiddenException(error);
    }
  }

  async getRoleOfUserChannel(userId: string, channelId: string) {
    try {
      await this.checkChannel(channelId);
      const myRole: { role: ChannelRole } =
        await this.prisma.channelUser.findUnique({
          where: {
            userId_channelId: {
              userId: userId,
              channelId: channelId,
            },
          },
          select: {
            role: true,
          },
        });
      return myRole;
    } catch (error) {
      if (error.status === 404) throw new NotFoundException(error);
      else throw new ForbiddenException(error);
    }
  }

  async getRolesOfUsersChannel(channelId: string) {
    try {
      await this.checkChannel(channelId);
      const roles: {
        userId: string;
        role: ChannelRole;
      }[] = await this.prisma.channelUser.findMany({
        where: {
          channelId: channelId,
        },
        select: {
          userId: true,
          role: true,
        },
      });
      return roles;
    } catch (error) {
      if (error.status === 404) throw new NotFoundException(error);
      else throw new ForbiddenException(error);
    }
  }

  async getInvitesOfAChannel(channelId: string) {
    try {
      await this.checkChannel(channelId);
      const invitesList: { invites: User[] } =
        await this.prisma.channel.findUnique({
          where: {
            id: channelId,
          },
          select: {
            invites: true,
          },
        });
      const invites: User[] = [];
      for (let i = 0; i < invitesList.invites.length; i++) {
        invites.push(invitesList.invites[i]);
      }
      return invites;
    } catch (error) {
      if (error.status === 404) throw new NotFoundException(error);
      else throw new ForbiddenException(error);
    }
  }

  async getInvitableUsers(userId: string, channelId: string) {
    try {
      await this.checkChannel(channelId);
      const invitedUsers: { invites: { id: string }[] } =
        await this.prisma.channel.findUnique({
          where: {
            id: channelId,
          },
          select: {
            invites: {
              select: {
                id: true,
              },
            },
          },
        });
      const membersOfChannel: { users: { userId: string }[] } =
        await this.prisma.channel.findUnique({
          where: {
            id: channelId,
          },
          select: {
            users: {
              select: {
                userId: true,
              },
            },
          },
        });
      const allUsers: { id: string; nickname: string; avatarImg: string }[] =
        await this.prisma.user.findMany({
          select: {
            id: true,
            nickname: true,
            avatarImg: true,
          },
        });
      const invitableUsers: {
        id: string;
        nickname: string;
        avatarImg: string;
      }[] = [];
      for (let i = 0; i < allUsers.length; i++) {
        if (
          !(
            invitedUsers.invites.find((user) => user.id === allUsers[i].id) ||
            membersOfChannel.users.find(
              (user) => user.userId === allUsers[i].id,
            )
          ) &&
          userId !== allUsers[i].id
        ) {
          invitableUsers.push(allUsers[i]);
        }
      }
      return invitableUsers;
    } catch (error) {
      if (error.status === 404) throw new NotFoundException(error);
      else throw new ForbiddenException(error);
    }
  }

  async getMessagesFromChannel(channelId: string, res: Response) {
    // Use userId to verify that user requesting message belong to channel or is not banned
    // Retrieve all messages from channel using its id
    try {
      const objMessages = await this.prisma.channel.findFirst({
        where: {
          id: channelId,
        },
        select: {
          messages: true,
        },
      });
      if (objMessages) {
        return res.status(200).send(objMessages.messages);
      } else {
        return res.status(500).send();
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send();
    }
  }

  //******   CHAT WEBSOCKETS SERVICES *******//

  async connectToChannel(
    userId: string,
    channelId: string,
    clientSocket: Socket,
  ) {
    const userOnChannel: ChannelUser = await this.prisma.channelUser.findUnique(
      {
        where: {
          userId_channelId: {
            userId: userId,
            channelId: channelId,
          },
        },
      },
    );
    /* then reconnect to the channel regardless of its type */
    if (userOnChannel != null) {
      clientSocket.join(channelId);
    }
    return userOnChannel;
  }

  async createChannelWS(
    dto: CreateChannelDto,
    userId: string,
    clientSocket: Socket,
  ) {
    try {
      /* Check the password is provided in the DTO for protected chan) */
      if ((dto.type === 'PROTECTED' && !dto.passwordHash) || dto.name === '') {
        throw new Error('WrongData');
      }
      /* Hash the password */
      if (dto.type === 'PROTECTED') {
        dto.passwordHash = await argon.hash(dto.passwordHash, {
          type: argon.argon2id,
        });
      }
      /* Then try to create a new channel */
      const createdChannel: Channel = await this.prisma.channel.create({
        data: {
          ...dto,
          users: {
            create: {
              userId: userId,
              role: 'OWNER',
            },
          },
        },
      });
      delete createdChannel.passwordHash;
      /* create and join room instance */
      clientSocket.join(createdChannel.id);
      return createdChannel;
    } catch (error) {
      if (error.code === 'P2002') {
        return 'alreadyUsed' + error.meta.target[0];
      }
      if (error == 'Error: WrongData') {
        return 'WrongData';
      }
      return null;
    }
  }

  async createDirectMessageWS(
    dto: CreateChannelDto,
    userId: string,
    clientSocket: Socket,
  ) {
    try {
      /* Check if one of the user is blocked by the other */
      const usersBlockedEachOther =
        await this.blockService.checkUsersBlockRelation(userId, dto.userId);
      if (usersBlockedEachOther) return 'Users blocked each other';

      /* Check if a DM between the 2 users already exists */
      const conversationAlreadyExist = await this.getDirectMessageByUserId(
        userId,
        dto.userId,
      );
      if (conversationAlreadyExist) {
        delete conversationAlreadyExist.passwordHash;
        return conversationAlreadyExist;
      }

      /* Create a DM between the 2 users */
      const createdChannel: Channel = await this.prisma.channel.create({
        data: {
          type: 'DIRECTMESSAGE',
          users: {
            create: [
              {
                userId: userId,
                role: 'USER',
              },
              {
                userId: dto.userId,
                role: 'USER',
              },
            ],
          },
        },
      });
      delete createdChannel.passwordHash;
      /* create and join room instance */
      clientSocket.join(createdChannel.id);
      return createdChannel;
    } catch (error) {
      if (error.code === 'P2002') {
        return 'alreadyUsed' + error.meta.target[0];
      }
      if (error == 'Error: WrongData') {
        return 'WrongData';
      }
      return null;
    }
  }

  async getIsInvitedInAChannel(userId: string, channelId: string) {
    const isInvited = await this.prisma.channel.findUnique({
      where: {
        id: channelId,
      },
      select: {
        invites: {
          select: {
            id: true,
          },
        },
      },
    });
    return isInvited.invites.find((value) => {
      return value.id === userId;
    })
      ? true
      : false;
  }

  async getModerationActionInfo(
    userTargetId: string,
    channelId: string,
    channelActionType: ChannelActionType,
  ) {
    try {
      const moderationAction = await this.prisma.channelAction.findUnique({
        where: {
          channelActionTargetId_channelActionOnChannelId: {
            channelActionTargetId: userTargetId,
            channelActionOnChannelId: channelId,
          },
        },
        select: {
          type: true,
          channelActionTargetId: true,
          channelActionTime: true,
        },
      });
      console.log(moderationAction);
      return moderationAction;
    } catch (error) {
      console.log(error);
    }
  }
  async deleteChannelAction(
    channelId: string,
    targetUserId: string,
    actionType: ChannelActionType,
  ) {
    try {
      const deletedChannelAction = await this.prisma.channelAction.deleteMany({
        where: {
          AND: [
            { channelActionTargetId: targetUserId },
            {
              channelActionOnChannelId: channelId,
            },
            { type: actionType },
          ],
        },
      });
      console.log(deletedChannelAction);
    } catch (error) {
      console.log(error);
    }
  }

  async getListOfUsersUnderModerationInChannel(
    channelId: string,
    channelActionType: ChannelActionType,
  ) {
    const usersUnderModeration = await this.prisma.channelAction.findMany({
      where: {
        channelActionOnChannelId: channelId,
        type: channelActionType,
      },
    });
    return usersUnderModeration;
  }

  async listAndUpdateBannedUsers(
    bannedList: ChannelAction[],
    channelId: string,
    banAction: ChannelActionType,
  ) {
    const banUsersList = [];
    for (let index = 0; index < bannedList.length; index++) {
      const banExpirationDate = Number(
        Date.parse(bannedList[index].channelActionTime.toString()),
      );
      const currentTime = Date.now();
      if (banExpirationDate - currentTime < 0) {
        await this.deleteChannelAction(
          channelId,
          bannedList[index].channelActionTargetId,
          banAction,
        );
      } else {
        banUsersList.push(bannedList[index].channelActionTargetId);
      }
    }
    return banUsersList;
  }

  async listMutedUsers(bannedList: ChannelAction[]) {
    const mutedUsersList = [];
    for (let index = 0; index < bannedList.length; index++) {
      mutedUsersList.push(bannedList[index].channelActionTargetId);
    }
    return mutedUsersList;
  }

  async getUsersUnderModerationAction(
    channelId: string,
    channelActionType: ChannelActionType,
  ) {
    try {
      const usersUnderModeration =
        await this.getListOfUsersUnderModerationInChannel(
          channelId,
          channelActionType,
        );
      if (channelActionType === ChannelActionType.BAN) {
        return this.listAndUpdateBannedUsers(
          usersUnderModeration,
          channelId,
          channelActionType,
        );
      } else if (channelActionType === ChannelActionType.MUTE) {
        return this.listMutedUsers(usersUnderModeration);
      } else {
        throw new BadRequestException();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async joinChannelWS(
    channelDto: JoinChannelDto,
    userId: string,
    clientSocket: Socket,
  ) {
    try {
      /** If private channel, check the invitation to the channel */
      if (channelDto.type === ChannelType.PRIVATE) {
        const isInvited = await this.getIsInvitedInAChannel(
          userId,
          channelDto.id,
        );
        if (!isInvited) throw new Error('errorNotInvited');
      }
      /* If there is a channel's password and a password provided */
      if (channelDto.type === ChannelType.PROTECTED) {
        /* Check the password is provided in the DTO - mandatory for Protected channels) */
        if (!channelDto.passwordHash) throw new Error('PasswordRequired');
        /* Get the channel's password if the type is protected */
        const channel: { type: ChannelType; passwordHash: string } =
          await this.prisma.channel.findFirst({
            where: {
              id: channelDto.id,
              type: ChannelType.PROTECTED,
            },
            select: {
              type: true,
              passwordHash: true,
            },
          });
        /* Compare passwords */
        const pwdMatches = await argon.verify(
          channel.passwordHash,
          channelDto.passwordHash,
        );
        /* If passwords don't match, throw error */
        if (!pwdMatches) throw new Error('InvalidPassword');
      }
      /* Then, join channel */
      const joinedChannel: Channel = await this.prisma.channel.update({
        where: {
          id: channelDto.id,
        },
        data: {
          users: {
            create: {
              userId: userId,
              role: 'USER',
            },
          },
        },
      });
      /* Join socket.io room instance */
      clientSocket.join(channelDto.id);
      delete joinedChannel.passwordHash;
      return joinedChannel;
    } catch (error) {
      if (error == 'Error: errorNotInvited') {
        return 'notInvited';
      } else if (error == 'Error: PasswordRequired') {
        return 'PasswordRequired';
      } else if (error == 'Error: InvalidPassword') {
        return 'InvalidPassword';
      }
      return 'errorJoinChannel';
    }
  }

  async storeMessage(userId: string, messageInfo: IncomingMessageDto) {
    try {
      //TODO Check if user is muted/banned
      const messagesObj: { messages: Message[] } =
        await this.prisma.channel.update({
          where: {
            id: messageInfo.channelId,
          },
          data: {
            messages: {
              create: {
                senderId: userId,
                content: messageInfo.content,
              },
            },
          },
          select: {
            messages: true,
          },
        });
      //return last message saved to db
      return messagesObj.messages[messagesObj.messages.length - 1];
    } catch (error) {
      return null;
    }
  }

  async handlePasswords(dto: EditChannelDto, channelId: string) {
    /* Get the channel password to verify if the dto's current password is right */
    const channel: { passwordHash: string } =
      await this.prisma.channel.findFirst({
        where: {
          id: channelId,
        },
        select: {
          passwordHash: true,
        },
      });
    if (channel.passwordHash && !dto.passwordHash) {
      /* There is already a password and no new password provided,
      we shouldn't remove the pwd in db */
      delete dto.passwordHash;
    } else if (dto.passwordHash) {
      /* There is a new password provided, we hash it for the db */
      dto.passwordHash = await argon.hash(dto.passwordHash, {
        type: argon.argon2id,
      });
    } else {
      /* There is no new password for a Protected type channel */
      throw new Error('passwordIncorrect');
    }
  }

  async editChannelByIdWS(
    userId: string,
    channelId: string,
    dto: EditChannelDto,
  ) {
    try {
      /* Check the password is provided in the DTO for protected chan) */
      if (dto.name === '') {
        return null;
      }
      /* Check that the user is owner or admin for update rights */
      const userRole: { role: ChannelRole } = await this.getRoleOfUserChannel(
        userId,
        channelId,
      );
      if (!userRole || userRole.role < ChannelRole.ADMIN) {
        return 'noEligibleRights';
      }
      if (dto.type === ChannelType.PROTECTED) {
        await this.handlePasswords(dto, channelId);
      }
      /* Then, update channel's information */
      const editedChannel: Channel = await this.prisma.channel.update({
        where: {
          id: channelId,
        },
        data: {
          ...dto,
        },
      });
      delete editedChannel.passwordHash;
      return editedChannel;
    } catch (error) {
      if (error.code === 'P2002') {
        return 'alreadyUsed' + error.meta.target[0];
      }
      if (error == 'Error: passwordIncorrect') {
        return 'passwordIncorrect';
      }
      return null;
    }
  }

  async leaveChannelWS(userId: string, dto: LeaveChannelDto) {
    try {
      // Remove user from channel users ('user leave room')
      let leavingUser = await this.prisma.channelUser.delete({
        where: {
          userId_channelId: {
            userId: userId,
            channelId: dto.id,
          },
        },
      });
      /* Verify if user asking for channel deletion is alone in channel */
      const channelUsers: { users: ChannelUser[] } =
        await this.prisma.channel.findUnique({
          where: {
            id: dto.id,
          },
          select: {
            users: true,
          },
        });
      /* Verify if channel is of type direct message */
      const channel = await this.getChannelById(dto.id);
      if (
        channel.type === ChannelType.DIRECTMESSAGE &&
        channelUsers.users.length > 0
      ) {
        leavingUser = await this.prisma.channelUser.delete({
          where: {
            userId_channelId: {
              userId: channelUsers.users[0].userId,
              channelId: dto.id,
            },
          },
        });
      }
      /* Then, delete channel */
      // If user is the last one or channel is of type direct message delete the channel
      if (
        channelUsers.users.length === 0 ||
        channel.type === ChannelType.DIRECTMESSAGE
      ) {
        await this.prisma.channel.delete({
          where: {
            id: dto.id,
          },
        });
      }
      return leavingUser;
    } catch (error) {
      return null;
    }
  }

  async inviteToChannelWS(userId: string, inviteDto: InviteChannelDto) {
    if (!inviteDto.type || inviteDto.type !== ChannelType.PRIVATE)
      return 'notPrivateChannel';
    else if (!inviteDto.channelId || !inviteDto.invitedId)
      return 'missingDtoData';
    const userRole: { role: ChannelRole } = await this.getRoleOfUserChannel(
      userId,
      inviteDto.channelId,
    );
    if (!userRole || userRole.role < ChannelRole.ADMIN) {
      return 'noEligibleRights';
    }
    try {
      const isInvited = await this.getIsInvitedInAChannel(
        inviteDto.invitedId,
        inviteDto.channelId,
      );
      if (isInvited) throw new Error('alreadyInvited');
      const channelInvite: Channel = await this.prisma.channel.update({
        where: {
          id: inviteDto.channelId,
        },
        data: {
          invites: {
            connect: { id: inviteDto.invitedId },
          },
        },
      });
      return channelInvite;
    } catch (error) {
      if (error == 'Error: alreadyInvited') {
        return 'alreadyInvited';
      }
      console.log(error);
    }
  }

  async banFromChannelWS(requesterId: string, banInfo: ModerateChannelDto) {
    try {
      //Check if channel is not a direct channel
      const typeOfChannel: { type: ChannelType } =
        await this.prisma.channel.findUnique({
          where: {
            id: banInfo.channelActionOnChannelId,
          },
          select: {
            type: true,
          },
        });
      if (typeOfChannel.type === ChannelType.DIRECTMESSAGE) {
        return 'cannotBanInDirectMessage';
      }
      //Verify Admin or Owner Role
      const userRole: { role: ChannelRole } = await this.getRoleOfUserChannel(
        requesterId,
        banInfo.channelActionOnChannelId,
      );
      if (
        userRole.role !== ChannelRole.OWNER &&
        userRole.role !== ChannelRole.ADMIN
      ) {
        return 'noEligibleRights';
      }
      // Target User is not owner of the channel
      const targetRole: { role: ChannelRole } =
        await this.prisma.channelUser.findUnique({
          where: {
            userId_channelId: {
              userId: banInfo.channelActionTargetId,
              channelId: banInfo.channelActionOnChannelId,
            },
          },
          select: {
            role: true,
          },
        });
      if (targetRole.role === ChannelRole.OWNER) {
        return 'cannotBanOwner';
      }
      // Target User exist in channel and is not already banned
      const isAlreadyBanned = await this.prisma.channelAction.findUnique({
        where: {
          channelActionTargetId_channelActionOnChannelId: {
            channelActionTargetId: banInfo.channelActionTargetId,
            channelActionOnChannelId: banInfo.channelActionOnChannelId,
          },
        },
        select: {
          channelActionTarget: true,
        },
      });
      if (isAlreadyBanned !== null) {
        console.log('Cannot be banned: ', isAlreadyBanned);
        return 'cannotBeBanned';
      } else {
        console.log('Can be banned: ', isAlreadyBanned);
      }
      const banDurationInMS = 30 * 1000;
      const banExpirationDate = new Date(Date.now() + banDurationInMS);
      console.log(banExpirationDate);
      const bannedUser = await this.prisma.channelAction.create({
        data: {
          channelActionTargetId: banInfo.channelActionTargetId,
          channelActionOnChannelId: banInfo.channelActionOnChannelId,
          channelActionTime: banExpirationDate,
          type: ChannelActionType.BAN,
          channelActionRequesterId: requesterId,
        },
        select: {
          channelActionTargetId: true,
          channelActionOnChannelId: true,
        },
      });
      console.log(bannedUser);
      return bannedUser;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async updateAdminRoleByChannelIdWS(
    userId: string,
    channelId: string,
    dto: EditRoleChannelDto,
  ) {
    try {
      /** First, check the current user asking promotion is the owner of the channel */
      const userRole: { role: ChannelRole } = await this.getRoleOfUserChannel(
        userId,
        channelId,
      );
      if (!userRole || userRole.role < ChannelRole.ADMIN) {
        return 'noEligibleRights';
      }
      /** Then, check the targeted user exists + is user or admin of the channel */
      const targetRole: { role: ChannelRole } = await this.getRoleOfUserChannel(
        dto.promotedUserId,
        channelId,
      );
      if (!targetRole || targetRole.role === ChannelRole.OWNER) {
        return 'PromotionNotAuthorized';
      }
      /** Toggle Admin role regarding the current role */
      const newRole: ChannelRole =
        targetRole.role === ChannelRole.USER
          ? ChannelRole.ADMIN
          : ChannelRole.USER;
      /* Then, update the role of the user targeted to Admin in the channel */
      const editedTarget: { role: ChannelRole } =
        await this.prisma.channelUser.update({
          where: {
            userId_channelId: {
              userId: dto.promotedUserId,
              channelId: channelId,
            },
          },
          data: {
            role: newRole,
          },
          select: {
            role: true,
          },
        });
      return editedTarget.role;
    } catch (error) {
      console.log(error);
    }
  }
}
