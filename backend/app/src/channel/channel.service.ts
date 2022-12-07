import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
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
  UserStatus,
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
    const channels: {
      id: string;
      name: string;
      type: ChannelType;
    }[] = await this.prisma.channel.findMany({
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
    for (const channel of channels) {
      if (channel.type === 'DIRECTMESSAGE') {
        const channelUser:
          | {
              id: string;
              avatarImg: string | null;
              nickname: string;
              eloScore: number;
              status: UserStatus;
              twoFactorAuthenticationSet: boolean;
            }[]
          | undefined = await this.getUsersOfAChannel(channel.id);
        if (channelUser && channelUser[0].id === userId && channelUser[1])
          channel.name = channelUser[1].nickname;
        else if (channelUser) channel.name = channelUser[0].nickname;
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
    for (const message of allDirectMessages) {
      const users = await this.getUsersOfAChannel(message.id);
      if (
        users &&
        ((users.length > 1 &&
          users[0].id === userId &&
          users[1].id === participantId) ||
          (users[0].id === participantId && users[1].id === userId))
      )
        return message;
    }
    return null;
  }

  async getChannelAuthors(channelId: string) {
    try {
      const authors: {
        sender: {
          id: string;
          nickname: string;
          avatarImg: string | null;
        };
      }[] = await this.prisma.message.findMany({
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
      const flattenAuthors: {
        id: string;
        nickname: string;
        avatarImg: string | null;
      }[] = [];
      for (const author of authors) {
        flattenAuthors.push(author.sender);
      }
      return flattenAuthors;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async getChannelType(channelId: string) {
    return await this.prisma.channel.findUnique({
      where: {
        id: channelId,
      },
      select: {
        type: true,
      },
    });
  }

  async checkChannel(channelId: string) {
    const channel: Channel | null = await this.prisma.channel.findFirst({
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
      const users: {
        user: {
          id: string;
          avatarImg: string | null;
          nickname: string;
          eloScore: number;
          status: UserStatus;
          twoFactorAuthenticationSet: boolean;
        };
      }[] = await this.prisma.channelUser.findMany({
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
      const flattenUsers: {
        id: string;
        avatarImg: string | null;
        nickname: string;
        eloScore: number;
        status: UserStatus;
        twoFactorAuthenticationSet: boolean;
      }[] = [];
      for (const user of users) {
        flattenUsers.push(user.user);
      }
      return flattenUsers;
    } catch (error) {
      if (error.status === 404) return undefined;
      else throw new ForbiddenException(error);
    }
  }

  async getRoleOfUserChannel(userId: string, channelId: string) {
    try {
      await this.checkChannel(channelId);
      const myRole: { role: ChannelRole } | null =
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
      return null;
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
    } catch (error) {}
  }

  async getInvitesOfAChannel(channelId: string) {
    try {
      await this.checkChannel(channelId);
      const invitesList: { invites: User[] } | null =
        await this.prisma.channel.findUnique({
          where: {
            id: channelId,
          },
          select: {
            invites: true,
          },
        });
      const invites: User[] = [];
      if (invitesList !== null)
        for (const invite of invitesList.invites) {
          invites.push(invite);
        }
      return invites;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async getInvitableUsers(userId: string, channelId: string) {
    try {
      await this.checkChannel(channelId);
      const invitedUsers: {
        invites: {
          id: string;
        }[];
      } | null = await this.prisma.channel.findUnique({
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
      const membersOfChannel: { users: { userId: string }[] } | null =
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
      const allUsers: {
        id: string;
        nickname: string;
        avatarImg: string | null;
      }[] = await this.prisma.user.findMany({
        select: {
          id: true,
          nickname: true,
          avatarImg: true,
        },
      });
      const invitableUsers: {
        id: string;
        nickname: string;
        avatarImg: string | null;
      }[] = [];
      for (const aUser of allUsers) {
        if (
          !(
            invitedUsers?.invites.find((user) => user.id === aUser.id) ||
            membersOfChannel?.users.find((user) => user.userId === aUser.id)
          ) &&
          userId !== aUser.id
        ) {
          invitableUsers.push(aUser);
        }
      }
      return invitableUsers;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async getMessagesFromChannel(
    channelId: string,
    userRequesting: string,
    res: Response,
  ) {
    try {
      const userIsBanned = await this.isUserUnderModeration({
        channelActionOnChannelId: channelId,
        channelActionTargetId: userRequesting,
        type: ChannelActionType.BAN,
      });
      if (userIsBanned) {
        return res.status(401).send();
      }
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
      throw new ForbiddenException(error);
    }
  }

  //******   CHAT WEBSOCKETS SERVICES *******//

  async connectToChannel(
    userId: string,
    channelId: string,
    clientSocket: Socket,
  ) {
    const userOnChannel: ChannelUser | null =
      await this.prisma.channelUser.findUnique({
        where: {
          userId_channelId: {
            userId: userId,
            channelId: channelId,
          },
        },
      });
    /* then reconnect to the channel regardless of its type */
    if (userOnChannel != null) {
      await clientSocket.join(channelId);
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
      if (typeof dto.passwordHash === 'string' && dto.type === 'PROTECTED') {
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
      /* Delete passwordHash in the object sent to the front */
      createdChannel.passwordHash = '';
      /* create and join room instance */
      await clientSocket.join(createdChannel.id);
      return createdChannel;
    } catch (error) {
      if (error.code === 'P2002') {
        return 'alreadyUsed';
      }
      if (error === 'string' && error == 'Error: WrongData') {
        return 'WrongData';
      }
      if (typeof error === 'string') return error;
      return 'errorCreateChannel';
    }
  }

  async createDirectMessageWS(
    dto: CreateChannelDto,
    userId: string,
    clientSocket: Socket,
  ) {
    try {
      /* Check if one of the user is blocked by the other */
      if (typeof dto.userId !== 'string') return null;
      const usersBlockedEachOther =
        await this.blockService.checkUsersBlockRelation(userId, dto.userId);
      if (usersBlockedEachOther) return 'Users blocked each other';

      /* Check if a DM between the 2 users already exists */
      const conversationAlreadyExist = await this.getDirectMessageByUserId(
        userId,
        dto.userId,
      );
      if (conversationAlreadyExist) {
        conversationAlreadyExist.passwordHash = '';
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
      createdChannel.passwordHash = '';
      /* create and join room instance */
      await clientSocket.join(createdChannel.id);
      return createdChannel;
    } catch (error) {
      if (error.code === 'P2002') {
        return 'alreadyUsed';
      }
      if (typeof error === 'string' && error == 'Error: WrongData') {
        return 'WrongData';
      }
      if (typeof error === 'string') return error;
      return 'errorCreateDirectMessage';
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
    return isInvited?.invites.find((value) => {
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
          channelActionTargetId_channelActionOnChannelId_type: {
            channelActionTargetId: userTargetId,
            channelActionOnChannelId: channelId,
            type: channelActionType,
          },
        },
        select: {
          type: true,
          channelActionTargetId: true,
          channelActionTime: true,
        },
      });
      return moderationAction;
    } catch (error) {
      if (typeof error === 'string') return error;
      return 'errorGetModerationActionInfo';
    }
  }
  async deleteChannelAction(
    channelId: string,
    targetUserId: string,
    actionType: ChannelActionType,
  ) {
    try {
      await this.prisma.channelAction.deleteMany({
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
    } catch (error) {
      if (typeof error === 'string') return error;
      return 'errorDeleteChannelAction';
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

  async updateUsersUnderModeration(
    moderationActions: ChannelAction[],
    channelId: string,
    actionType: ChannelActionType,
  ) {
    const userUnderModerationList: string[] = [];
    const currentTime = Date.now();
    for (const action of moderationActions) {
      const banExpirationDate = Number(
        Date.parse(action.channelActionTime.toString()),
      );
      if (banExpirationDate - currentTime < 0) {
        await this.deleteChannelAction(
          channelId,
          action.channelActionTargetId,
          actionType,
        );
      } else {
        userUnderModerationList.push(action.channelActionTargetId);
      }
    }
    return userUnderModerationList;
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
      //return a list of userId for target still under moderation
      return this.updateUsersUnderModeration(
        usersUnderModeration,
        channelId,
        channelActionType,
      );
    } catch (error) {}
  }

  async isUserUnderModeration(moderationInfo: ModerateChannelDto) {
    try {
      const usersUnderModeration: string[] | undefined =
        await this.getUsersUnderModerationAction(
          moderationInfo.channelActionOnChannelId,
          moderationInfo.type,
        );
      return usersUnderModeration?.some(
        (targetId) => targetId === moderationInfo.channelActionTargetId,
      );
    } catch (error) {}
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
        const channel: {
          type: ChannelType;
          passwordHash: string | null;
        } | null = await this.prisma.channel.findFirst({
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
        if (typeof channel?.passwordHash === 'string') {
          const pwdMatches = await argon.verify(
            channel.passwordHash,
            channelDto.passwordHash,
          );
          /* If passwords don't match, throw error */
          if (!pwdMatches) throw new Error('InvalidPassword');
        }
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
      await clientSocket.join(channelDto.id);
      joinedChannel.passwordHash = '';
      return joinedChannel;
    } catch (error) {
      if (error == 'Error: errorNotInvited') {
        return 'notInvited';
      } else if (error == 'Error: PasswordRequired') {
        return 'PasswordRequired';
      } else if (error == 'Error: InvalidPassword') {
        return 'InvalidPassword';
      }
      if (typeof error === 'string') return error;
      return 'errorJoinChannel';
    }
  }

  async storeMessage(userId: string, messageInfo: IncomingMessageDto) {
    try {
      const userIsBanned = await this.isUserUnderModeration({
        channelActionOnChannelId: messageInfo.channelId,
        channelActionTargetId: userId,
        type: ChannelActionType.BAN,
      });
      if (userIsBanned) {
        return null;
      }
      const userIsMuted = await this.isUserUnderModeration({
        channelActionOnChannelId: messageInfo.channelId,
        channelActionTargetId: userId,
        type: ChannelActionType.MUTE,
      });
      if (userIsMuted) {
        return null;
      }
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
      if (typeof error === 'string') return error;
      return 'errorStoreMessage';
    }
  }

  async handlePasswords(dto: EditChannelDto, channelId: string) {
    /* Get the channel password to verify if the dto's current password is right */
    const channel: { passwordHash: string | null } | null =
      await this.prisma.channel.findFirst({
        where: {
          id: channelId,
        },
        select: {
          passwordHash: true,
        },
      });
    if (channel?.passwordHash && !dto.passwordHash) {
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
      const userRole: { role: ChannelRole } | null =
        await this.getRoleOfUserChannel(userId, channelId);
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
      editedChannel.passwordHash = '';
      return editedChannel;
    } catch (error) {
      if (error.code === 'P2002') {
        return 'alreadyUsed';
      }
      if (error == 'Error: passwordIncorrect') {
        return 'passwordIncorrect';
      }
      if (typeof error === 'string') return error;
      return 'errorEditChannel';
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
      const channelUsers: { users: ChannelUser[] } | null =
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
        channel?.type === ChannelType.DIRECTMESSAGE &&
        channelUsers &&
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
        channelUsers?.users.length === 0 ||
        channel?.type === ChannelType.DIRECTMESSAGE
      ) {
        await this.prisma.channel.delete({
          where: {
            id: dto.id,
          },
        });
      }
      return leavingUser;
    } catch (error) {
      if (typeof error === 'string') return error;
      return 'errorLeaveChannel';
    }
  }

  async inviteToChannelWS(userId: string, inviteDto: InviteChannelDto) {
    if (inviteDto.type !== ChannelType.PRIVATE) return 'notPrivateChannel';
    else if (!inviteDto.channelId || !inviteDto.invitedId)
      return 'missingDtoData';
    const userRole: { role: ChannelRole } | null =
      await this.getRoleOfUserChannel(userId, inviteDto.channelId);
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
      if (typeof error === 'string' && error == 'Error: alreadyInvited') {
        return 'alreadyInvited';
      }
      if (typeof error === 'string') return error;
      return 'errorChannelInvite';
    }
  }

  async checkIfCanEnforceModeration(
    requesterId: string,
    moderationInfo: ModerateChannelDto,
  ): Promise<string | undefined> {
    try {
      //Check if channel is not a direct channel
      const typeOfChannel: { type: ChannelType } | null =
        await this.getChannelType(moderationInfo.channelActionOnChannelId);
      if (typeOfChannel?.type === ChannelType.DIRECTMESSAGE) {
        return 'cannotModerateInDirectMessage';
      }
      //Verify if current user is Admin or Owner
      const userRole: { role: ChannelRole } | null =
        await this.getRoleOfUserChannel(
          requesterId,
          moderationInfo.channelActionOnChannelId,
        );
      if (
        userRole?.role !== ChannelRole.OWNER &&
        userRole?.role !== ChannelRole.ADMIN
      ) {
        return 'noEligibleRights';
      }
      // Verify if Target User is not owner of the channel
      const targetRole: { role: ChannelRole } | null =
        await this.getRoleOfUserChannel(
          moderationInfo.channelActionTargetId,
          moderationInfo.channelActionOnChannelId,
        );
      if (targetRole?.role === ChannelRole.OWNER) {
        return 'cannotModerateOwner';
      }
      return 'Ok';
    } catch (error) {
      if (typeof error === 'string') return error;
      return 'errorcheckIfCanEnforceModeration';
    }
  }

  async banFromChannelWS(requesterId: string, banInfo: ModerateChannelDto) {
    try {
      const checksResults = await this.checkIfCanEnforceModeration(
        requesterId,
        banInfo,
      );
      if (checksResults !== 'Ok') {
        return checksResults;
      }
      const isAlreadyBanned = await this.isUserUnderModeration(banInfo);
      if (isAlreadyBanned) {
        return 'isAlreadyBanned';
      }
      // Getting ban timings
      const banDurationInMS = 30 * 1000;
      const banExpirationDate = new Date(Date.now() + banDurationInMS);
      // Actual ban added in DB
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
      return bannedUser;
    } catch (error) {
      if (typeof error === 'string') return error;
      return 'errorBanFromChannel';
    }
  }

  async muteFromChannelWS(requesterId: string, muteInfo: ModerateChannelDto) {
    try {
      const checksResults = await this.checkIfCanEnforceModeration(
        requesterId,
        muteInfo,
      );
      if (checksResults !== 'Ok') {
        return checksResults;
      }
      // Target User exist in channel and is not already banned
      const isAlreadyMuted = await this.isUserUnderModeration(muteInfo);
      if (isAlreadyMuted) {
        return 'isAlreadyMuted';
      }

      // Getting ban timings
      const MuteDurationInMS = 30 * 1000;
      const MuteExpirationDate = new Date(Date.now() + MuteDurationInMS);
      // Actual Mute added in DB
      const MutedUser = await this.prisma.channelAction.create({
        data: {
          channelActionTargetId: muteInfo.channelActionTargetId,
          channelActionOnChannelId: muteInfo.channelActionOnChannelId,
          channelActionTime: MuteExpirationDate,
          type: ChannelActionType.MUTE,
          channelActionRequesterId: requesterId,
        },
        select: {
          channelActionTargetId: true,
          channelActionOnChannelId: true,
        },
      });
      return MutedUser;
    } catch (error) {
      if (typeof error === 'string') return error;
      return 'errorMuteFromChannel';
    }
  }

  async updateAdminRoleByChannelIdWS(
    userId: string,
    channelId: string,
    dto: EditRoleChannelDto,
  ) {
    try {
      /** First, check the current user asking promotion is the owner of the channel */
      const userRole: { role: ChannelRole } | null =
        await this.getRoleOfUserChannel(userId, channelId);
      if (!userRole || userRole.role < ChannelRole.ADMIN) {
        return 'noEligibleRights';
      }
      /** Then, check the targeted user exists + is user or admin of the channel */
      const targetRole: { role: ChannelRole } | null =
        await this.getRoleOfUserChannel(dto.promotedUserId, channelId);
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
      if (typeof error === 'string') return error;
      return 'errorUpdateAdminChannel';
    }
  }
}
