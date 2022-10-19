import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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
      },
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
    })
  };

  getUsersOfAChannel(channelId: string) {
    return this.prisma.channelUser.findMany({
      where: {
        channelId: channelId,
      },
      select: {
        user: true,
      }
    })
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
    })
  };

}
