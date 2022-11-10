import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Channel, ChannelRole, ChannelType, ChannelUser } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChannelDto, EditChannelDto } from './dto';
import { Socket } from 'socket.io';
import { JoinChannelDto } from './dto/joinChannel.dto';
import { UserMessageDto } from './dto/userMessage.dto';
import { LeaveChannelDto } from './dto/leaveChannel.dto';
import * as argon from 'argon2';

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
    const channel: Channel = await this.prisma.channel.findUnique({
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
      return users;
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
    const channel: Channel = await this.prisma.channel.findUnique({
      where: {
        id: channelId,
      },
    });
    if (channel != null) {
      if (channel.type == 'PUBLIC') {
        await clientSocket.join(channelId);
      } else {
        //TODO If channel is protected check channelPassword
      }
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
        return null;
      }
      /* Hash the password */
      if (dto.type === 'PROTECTED') {
        dto.passwordHash = await argon.hash(dto.passwordHash, {
          type: argon.argon2id,
        });
      }
      /* Then try to create a new channel */
      //* What if channel name already exists ?
      const newChannel: Channel = await this.prisma.channel.create({
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
      delete newChannel.passwordHash;
      /* create and join room instance */
      clientSocket.join(newChannel.id);
      return newChannel;
    } catch (error) {
      if (error.code === 'P2002') {
        return 'alreadyUsed' + error.meta.target[0];
      }
      return null;
    }
  }

  async joinChannelWS(
    channelDto: JoinChannelDto,
    userId: string,
    clientSocket: Socket,
  ) {
    try {
      /* Check the password is provided in the DTO for protected chan) */

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
      return joinedChannel;
    } catch (error) {
      //TODO Improve error handling
      return null;
    }
  }

  async storeMessage(dto: UserMessageDto, channelId: string) {
    try {
      //TODO Check if user is muted/banned
      const channel: Channel = await this.prisma.channel.update({
        where: {
          id: channelId,
        },
        data: {
          messages: {
            create: {
              senderId: dto.senderId,
              content: dto.content,
            },
          },
        },
      });
      return channel;
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
      /* There is already a password and no new password provided, we shouldn't remove the pwd in db */
      delete dto.passwordHash;
    } else if (dto.passwordHash) {
      /* There is a new password provided, we hash it for the db */
      dto.passwordHash = await argon.hash(dto.passwordHash, {
        type: argon.argon2id,
      });
    } else {
      /* There is no new password for a Protected type channel */
      throw new Error('passwordIncorrect')
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
}
