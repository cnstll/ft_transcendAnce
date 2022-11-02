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
import { CreateChannelDto, EditChannelDto } from './dto';
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
      const role = this.prisma.channelUser.findUnique({
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
      return role;
    } catch (error) {
      if (error.status === 404) throw new NotFoundException(error);
      else throw new ForbiddenException(error);
    }
  }

  checkDto(dto: CreateChannelDto | EditChannelDto) {
    /* If a Protected channel is created/updated, it must have a password */
    if (dto.type === 'PROTECTED' && !dto.passwordHash) {
      throw new HttpException(
        'Protected channel must have a password.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createChannel(userId: string, dto: CreateChannelDto, res: Response) {
    try {
      /* Check the password is provided in the DTO for protected chan) */
      this.checkDto(dto);
      console.log(dto);
      /* Then try to create a new channel */
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
      if (error.status === 400) throw new BadRequestException(error);
      else throw new ForbiddenException(error);
    }
  }

  async checkChannelUser(userId: string, channelId: string) {
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
    dto: EditChannelDto,
    res: Response,
  ) {
    try {
      /* Check the password is provided in the DTO for protected chan) */
      this.checkDto(dto);
      /* Check that the user is owner or admin for update rights */
      await this.checkChannelUser(userId, channelId);
      /* Then, update channel's information */
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
      if (error.status === 400) throw new BadRequestException(error);
      else if (error.status === 404) throw new NotFoundException(error);
      else throw new ForbiddenException(error);
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
      if (error.status === 404) throw new NotFoundException(error);
      else throw new ForbiddenException(error);
    }
    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
