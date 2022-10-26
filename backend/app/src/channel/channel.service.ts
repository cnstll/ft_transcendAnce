import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
      throw new HttpException(
        'Group channel must have a name.',
        HttpStatus.BAD_REQUEST,
      );
    }
    /* If a Protected channel is created/updated, it must have a password */
    if (dto.type === 'PROTECTED' && !dto.passwordHash) {
      throw new HttpException(
        'Group channel must have a password.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createChannel(userId: string, dto: ChannelDto, res: Response) {
    /* Filters incompatible DTO arguments (no name for group channel
      or no password for protected chan) */
    try {
      this.checkCreationDto(dto);
    } catch (error) {
      throw new BadRequestException(error);
    }
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
      throw new HttpException(
        'Group channel must have a name.',
        HttpStatus.BAD_REQUEST,
      );
    }
    /* If a Protected channel is created/updated, it must have a password */
    if (dto.type === 'PROTECTED' && !dto.passwordHash) {
      throw new HttpException(
        'Group channel must have a password.',
        HttpStatus.BAD_REQUEST,
      );
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
    if (!admin) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    } else if (admin.role === 'USER') {
      throw new HttpException(
        'Access to resources denied',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async editChannelById(
    userId: string,
    channelId: string,
    dto: ChannelDto,
    res: Response,
  ) {
    /* Filters incompatible DTO arguments (empty name for group channel
      or no password for protected chan) */
    try {
      await this.checkUpdateDto(dto, userId, channelId);
    } catch (error) {
      if (error.status === 400) throw new BadRequestException(error);
      else if (error.status === 404) throw new NotFoundException(error);
      else throw new ForbiddenException(error);
    }
    /* Then, update channel's information */
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
      if (error.code === 404) throw new NotFoundException(error);
      else throw new ForbiddenException(error);
    }
    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
