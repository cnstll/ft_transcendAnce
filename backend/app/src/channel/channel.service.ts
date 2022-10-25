import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { Channel, ChannelRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ChannelDto } from './dto';
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
    return this.prisma.channelUser.findMany({
      where: {
        userId: userId,
      },
      select: {
        channel: true,
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

  getUsersOfAChannel(channelId: string) {
    return this.prisma.channelUser.findMany({
      where: {
        channelId: channelId,
      },
      select: {
        user: true,
      },
    });
  }

  getRoleOfUserChannel(userId: string, channelId: string) {
    return this.prisma.channelUser.findUnique({
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
  }

  checkCreationDto(dto: ChannelDto) {
    /* If a Group channel is created/updated, it must have a name */
    if (dto.type !== 'DIRECTMESSAGE' && (!dto.name || dto.name?.length == 0)) {
      return { statusCode: 400, message: 'Group channel must have a name.' };
    }
    /* If a Protected channel is created/updated, it must have a password */
    if (dto.type === 'PROTECTED' && !dto.passwordHash) {
      return {
        statusCode: 400,
        message: 'Group channel must have a password.',
      };
    }
    return { statusCode: 200, message: 'OK' };
  }

  async createChannel(userId: string, dto: ChannelDto, res: Response) {
    /* Filters incompatible DTO arguments (no name for group channel
      or no password for protected chan) */
    const ret: { statusCode: number; message: string } =
      this.checkCreationDto(dto);
    if (ret.statusCode !== 200)
      return res.status(HttpStatus.BAD_REQUEST).send(ret);
    /* Try to create a new channel */
    try {
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
      return res.status(HttpStatus.CREATED).send(newChannel);
    } catch (error) {
        throw new ForbiddenException(error);
      }
  }

  async checkUpdateDto(dto: ChannelDto, userId: string, channelId: string) {
    /* If a Group channel is created/updated, it must have a name */
    if (dto.type !== 'DIRECTMESSAGE' && dto.name?.length == 0) {
      return { statusCode: 400, message: 'Group channel must have a name.' };
    }
    /* If a Protected channel is created/updated, it must have a password */
    if (dto.type === 'PROTECTED' && !dto.passwordHash) {
      return {
        statusCode: 400,
        message: 'Group channel must have a password.',
      };
    }
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
    if (!admin)
      return { statusCode: 404, message: 'Not found' };
    else if (admin.role === 'USER')
      return { statusCode: 400, message: 'Access to resources denied' };
    return { statusCode: 200, message: 'OK' };
  }

  async editChannelById(
    userId: string,
    channelId: string,
    dto: ChannelDto,
    res: Response,
  ) {
    /* Filters incompatible DTO arguments (empty name for group channel
      or no password for protected chan) */
    const ret: { statusCode: number; message: string } = await
      this.checkUpdateDto(dto, userId, channelId);
    if (ret.statusCode === 400)
      return res.status(HttpStatus.BAD_REQUEST).send(ret);
    else if (ret.statusCode === 404)
      return res.status(HttpStatus.NOT_FOUND).send(ret);
    /* Then, update informations */
    try {
      const newChannel: Channel = await this.prisma.channel.update({
        where: {
          id: channelId,
        },
        data: {
          ...dto,
        },
      });
      return res.status(HttpStatus.OK).send(newChannel);
    } catch (error) {
        throw new ForbiddenException(error);
    }
  }

  async deleteChannelById(channelId: string, res: Response) {
    /* Check if there is no user left in channel before deletion
    - implementing ChannelUser's deletion is required for testing the code below */
    // const channelUsers: { users: ChannelUser[] } =
    //   await this.prisma.channel.findUnique({
    //     where: {
    //       id: channelId,
    //     },
    //     select: {
    //       users: true,
    //     }
    // })
    // if (channelUsers) {
    //   return res.status(HttpStatus.BAD_REQUEST).send(
    //     { "statusCode": 400,
    //       "message": "Access to resources denied"});
    // }

    /* Then, delete channel */
    try {
      await this.prisma.channel.delete({
        where: {
          id: channelId,
        },
      });
    } catch (error) {
      throw new ForbiddenException(error);
    }
    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
