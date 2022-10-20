import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { Channel, ChannelRole, ChannelUser } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelDto } from './dto';
import { Response } from 'express';

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  getChannels() {
    return this.prisma.channel.findMany();
  };

  getGroupChannels() {
    return this.prisma.channel.findMany({
      where: {
        OR: [{type: 'PUBLIC'}, {type: 'PRIVATE'}, {type: 'PROTECTED'}]
      }
    });
  };

  getChannelsByUserId(userId: string) {
    return this.prisma.channelUser.findMany({
      where: {
        userId: userId,
      },
      select: {
        channel: true,
      }
    })
  };

  getChannelById(channelId: string) {
    return this.prisma.channel.findFirst({
      where: {
        id: channelId,
      }
    })
  };

  getChannelByUserId(userId: string, channelId: string) {
    return this.prisma.channelUser.findUnique({
      where: {
        userId_channelId: {
          userId: userId,
          channelId: channelId
        }
      },
      select: {
        channel: true,
      }
    });
  };

  getUsersOfAChannel(channelId: string) {
    return this.prisma.channelUser.findMany({
      where: {
        channelId: channelId,
      },
      select: {
        user: true,
      }
    });
  };

  getRoleOfUserChannel(userId: string, channelId: string) {
    return this.prisma.channelUser.findUnique({
      where: {
        userId_channelId: {
          userId: userId,
          channelId: channelId
        }
      },
      select: {
        role: true,
      }
    });
  };

  async createChannel(userId: string, dto: ChannelDto, res: Response) {
    // Try to create a new channel first
    try {
      const newChannel: Channel = await this.prisma.channel.create({
        data: {
          ...dto,
          users: {
            create: {
              userId: userId,
              role: 'OWNER',
            }
          }
        }
      });
      return res.status(HttpStatus.CREATED).send(newChannel);
    } catch (error) {
      if (error.code === 'P2002') {
        return res.status(HttpStatus.BAD_REQUEST).send(
            { "statusCode": 400,
              "message": "Unique constraint: Name is already used"});
      }
      else {
        throw new ForbiddenException(error);
      }
    }
  }

  async editChannelById(userId: string, channelId: string, dto: ChannelDto, res: Response) {
    // Find the user's role to check the rights to update
    const admin: { role: ChannelRole } = await this.prisma.channelUser.findUnique({
      where: {
        userId_channelId: {
          userId: userId,
          channelId: channelId
        }
      },
      select: {
        role: true,
      }
    })
    // If relation doesn't exist or User doesn't have Owner or Admin role
    if (!admin || admin.role === 'USER') {
      return res.status(HttpStatus.BAD_REQUEST).send(
        { "statusCode": 400,
          "message": "Access to resources denied"});
    }
    // Then, update informations
    try {
      await this.prisma.channel.update({
        where: {
          id: channelId,
        },
        data: {
          ...dto,
        }
      });
    } catch (error) {
      if (error.code === 'P2002') {
        return res.status(HttpStatus.BAD_REQUEST).send(
          { "statusCode": 400,
            "message": "Unique constraint: Name is already used"});
      }
      else {
        throw new ForbiddenException(error);
      }
    }
    return res.status(HttpStatus.OK).send();
  };

  async deleteChannelById(channelId: string, res: Response) {
    // Check there is no user left in channel
    const channelUsers: { users: ChannelUser[] } = await this.prisma.channel.findUnique({
      where: {
        id: channelId,
      },
      select: {
        users: true,
      }
    })
    if (channelUsers) {
      return res.status(HttpStatus.BAD_REQUEST).send(
        { "statusCode": 400,
          "message": "Access to resources denied"});
    }
    // Then, delete channel
    try {
      await this.prisma.channel.delete({
        where: {
          id: channelId,
        }
      });
    } catch (error) {
        throw new ForbiddenException(error);
    }
    return res.status(HttpStatus.NO_CONTENT).send()
  }
}
