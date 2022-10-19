import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  getChannels() {
    return this.prisma.channel.findMany();
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
    return this.prisma.channel.findUnique({
      where: {
        id: channelId,
      }
    })
  };

  getChannelByUserId(userId: string, channelId: string) {
    return this.prisma.channelUser.findMany({
      where: {
        userId: userId,
        channelId: channelId,
      },
      select: {
        channel: true,
      }
    })
  };

}
