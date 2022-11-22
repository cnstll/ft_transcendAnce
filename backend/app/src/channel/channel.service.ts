import {
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
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChannelDto, EditChannelDto } from './dto';
import { Socket } from 'socket.io';
import { JoinChannelDto } from './dto/joinChannel.dto';
import { LeaveChannelDto } from './dto/leaveChannel.dto';
import * as argon from 'argon2';
import { InviteChannelDto } from './dto/inviteChannel.dto';
import { IncomingMessageDto } from './dto/incomingMessage.dto';
import { Response } from 'express';

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  getChannels() {
    return this.prisma.channel.findMany();
  }

  getGroupChannels() {
    return this.prisma.channel.findMany({
      where: {
        OR: [{ type: 'PUBLIC' }, { type: 'PRIVATE' }, { type: 'PROTECTED' }],
      },
    });
  }

  getChannelsByUserId(userId: string) {
    return this.prisma.channel.findMany({
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
      },
    });
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
          user: true,
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

  async getMessagesFromChannel(
    userId: string,
    channelId: string,
    res: Response,
  ) {
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

  async hasAdminRights(userId: string, channelId: string) {
    /* Find the user's role to check the rights to update */
    const admin: { role: ChannelRole } =
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
    /* If relation doesn't exist or User doesn't have Owner or Admin role */
    if (!admin || admin.role === 'USER') {
      return false;
    } else {
      return true;
    }
  }

  async connectToChannel(
    userId: string,
    channelId: string,
    channelPassword: string,
    clientSocket: Socket,
  ) {
    /* TO-DO Instead, it should check if UserChannel exist */
    const channel: Channel = await this.prisma.channel.findUnique({
      where: {
        id: channelId,
      },
    });
    /* then reconnect to the channel regardless of its type */
    if (channel != null) {
      await clientSocket.join(channelId);
    }
    return channel;
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

  async getIsInvitedInAChannel(userId: string, channelId: string) {
    try {
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
    } catch (error) {
      return error;
    }
  }

  async joinChannelWS(
    channelDto: JoinChannelDto,
    userId: string,
    clientSocket: Socket,
  ) {
    try {
      /* Check the password is provided in the DTO for protected chan) */

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
        if (!channelDto.passwordHash) throw new Error('PasswordRequired');
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
      const canEdit = await this.hasAdminRights(userId, channelId);
      if (!canEdit) {
        return null;
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
      const leavingUser = await this.prisma.channelUser.delete({
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
      /* Then, delete channel */
      // If user is the last one delete the channel
      if (channelUsers.users.length == 0) {
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
    if (userRole.role < ChannelRole.ADMIN) {
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
}
