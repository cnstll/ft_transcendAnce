import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BlockService {
  constructor(private prismaService: PrismaService) {}

  async addBlockedUser(userId: string, targetId: string) {
    try {
      const blockedUser = await this.prismaService.blockedUser.create({
        data: {
          channelBlockedRequesterId: userId,
          channelBlockedTargetId: targetId,
        },
      });
      return blockedUser;
    } catch (error) {
      if (typeof error === 'string') return error;
      return 'errorBlockService';
    }
  }

  async removeBlockedUser(userId: string, targetId: string) {
    try {
      const blockedUser = await this.prismaService.blockedUser.delete({
        where: {
          blockedId: {
            channelBlockedRequesterId: userId,
            channelBlockedTargetId: targetId,
          },
        },
      });
      return blockedUser;
    } catch (error) {
      if (typeof error === 'string') return error;
      return 'errorRemoveBlockUser';
    }
  }

  async usersWhoBlockedCurrentUser(userId: string) {
    try {
      const listUsersBlocked: string[] = [];
      const usersBlocked = await this.prismaService.blockedUser.findMany({
        where: {
          channelBlockedTargetId: userId,
        },
        select: {
          channelBlockedRequesterId: true,
        },
      });
      for (const user of usersBlocked) {
        listUsersBlocked.push(user.channelBlockedRequesterId);
      }
      return listUsersBlocked;
    } catch (error) {
      if (typeof error === 'string') return error;
      return 'errorUsersWhoBlocked';
    }
  }

  async usersBlockedByCurrentUser(userId: string) {
    try {
      const listUsersWhoBlocked: string[] = [];
      const usersWhoBlocked = await this.prismaService.blockedUser.findMany({
        where: {
          channelBlockedRequesterId: userId,
        },
        select: {
          channelBlockedTargetId: true,
        },
      });
      for (const user of usersWhoBlocked) {
        listUsersWhoBlocked.push(user.channelBlockedTargetId);
      }
      return listUsersWhoBlocked;
    } catch (error) {
      if (typeof error === 'string') return error;
      return 'errorUsersBlockedBy';
    }
  }

  async checkUsersBlockRelation(userId: string, targetId: string) {
    try {
      const userIsBlocked = await this.prismaService.blockedUser.findFirst({
        where: {
          OR: [
            {
              AND: [
                { channelBlockedRequesterId: userId },
                { channelBlockedTargetId: targetId },
              ],
            },
            {
              AND: [
                { channelBlockedRequesterId: targetId },
                { channelBlockedTargetId: userId },
              ],
            },
          ],
        },
      });
      if (!userIsBlocked) return false;
      else return true;
    } catch (error) {
      if (typeof error === 'string') return error;
      return 'errorCheckBlockRelationship';
    }
  }
}
