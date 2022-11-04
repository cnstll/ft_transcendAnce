import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { User, FriendshipStatus, UserStatus, Match } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import { StatDto } from './dto/stats.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Response } from 'express';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  /** User management */

  async createUser(dto: UserDto) {
    try {
      const user = await this.prismaService.user.create({
        data: {
          nickname: dto.nickname,
          immutableId: dto.immutableId.toString(),
          passwordHash: dto.passwordHash,
          avatarImg: dto.avatarImg,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials Taken');
        }
      } else {
        throw error;
      }
    }
  }

  async deleteUser(userId: string, res: Response) {
    try {
      await this.prismaService.user.delete({
        where: {
          id: userId,
        },
      });
    } catch (error) {
      console.log(error);
    }
    return res.send(204);
  }

  async getAllUsers(res: Response) {
    try {
      const nicknames = await this.prismaService.user.findMany({});
      return res.status(200).send(nicknames);
    } catch (error) {
      console.log(error);

      return res.status(500).send();
    }
  }

  async updateUserName(userId: string, newNickname: string, res: Response) {
    try {
      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          nickname: newNickname,
        },
      });
      return res.status(201).send();
    } catch (error) {
      return res.status(200).send();
    }
  }

  async updateAvatarImg(userId: string, newAvatarImg: string, res: Response) {
    try {
      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          avatarImg: newAvatarImg,
        },
      });
      return res.status(201).send();
    } catch (error) {
      return res.status(200).send();
    }
  }

  async getInfo(userId: string, userId1: string) {
    try {
      const user: User = await this.prismaService.user.findUnique({
        where: {
          id: userId1,
        },
      });
      const friendStatus = await this.getFriendStatus(userId, userId1);
      const userInfo = {
        id: user.id,
        nickname: user.nickname,
        avatarImg: user.avatarImg,
        eloScore: user.eloScore,
        status: user.status,
        friendStatus: friendStatus,
      };
      return userInfo;
    } catch (error) {
      return null;
    }
  }

  async getUserInfo(userId: string): Promise<User | undefined> {
    const user: User = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user;
  }

  findOneFromNickname(immutableId: string): Promise<User | undefined> {
    return this.prismaService.user.findUnique({
      where: {
        immutableId: immutableId,
      },
    });
  }

  findOne(immutableId: string): Promise<User | undefined> {
    return this.prismaService.user.findUnique({
      where: {
        immutableId: immutableId,
      },
    });
  }

  logout(res: Response) {
    return res.clearCookie('jwtToken', { httpOnly: true });
  }

  /** Friendship management */

  async requestFriend(
    requesterId: string,
    futureFriendNickname: string,
    res: Response,
  ) {
    const futureFriend: User = await this.findOne(futureFriendNickname);
    try {
      await this.prismaService.user.update({
        where: {
          id: requesterId,
        },
        data: {
          friendsRequester: {
            create: [{ addresseeId: futureFriend.id }],
          },
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send();
    }
    return res.status(201).send();
  }

  async updateFriendshipStatus(
    activeUserId: string,
    affectedUserId: string,
    friends: boolean,
    res: Response,
  ) {
    if (friends === true) {
      this.addFriend(activeUserId, affectedUserId, res);
    } else {
      this.deleteFriendship(activeUserId, affectedUserId, res);
    }
  }

  async deleteFriendship(activeUserId: string, target: string, res: Response) {
    const user: User = await this.findOne(target);
    try {
      const result = await this.prismaService.friendship.findFirst({
        where: {
          OR: [
            {
              AND: [{ requesterId: activeUserId }, { addresseeId: user.id }],
            },
            {
              AND: [{ addresseeId: activeUserId }, { requesterId: user.id }],
            },
          ],
        },
      });
      await this.prismaService.friendship.delete({
        where: {
          friendshipId: {
            addresseeId: result.addresseeId,
            requesterId: result.requesterId,
          },
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send();
    }
    return res.status(200).send();
  }

  async addFriend(
    activeUserId: string,
    requesterNickname: string,
    res: Response,
  ) {
    const status: FriendshipStatus = 'ACCEPTED';
    const requester: User = await this.findOne(requesterNickname);
    try {
      await this.prismaService.user.update({
        where: {
          id: activeUserId,
        },
        data: {
          friendsAddressee: {
            update: {
              where: {
                friendshipId: {
                  requesterId: requester.id,
                  addresseeId: activeUserId,
                },
              },
              data: {
                status: status,
              },
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send();
    }
    return res.status(200).send();
  }

  async getUserFriendRequests(userId: string, res: Response) {
    const friends = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        friendsAddressee: {
          where: {
            status: 'REQUESTED',
          },
          select: {
            requesterId: true,
          },
        },
      },
    });
    const friendsList = [];
    for (let i = 0; i < friends.friendsAddressee.length; i++) {
      friendsList.push(
        await this.getInfo(userId, friends.friendsAddressee[i].requesterId),
      );
    }
    return res.status(200).send(friendsList);
  }

  async getFriendStatus(userId1: string, userId2: string): Promise<string> {
    try {
      const friendStatus = await this.prismaService.friendship.findFirst({
        where: {
          OR: [
            {
              AND: [{ requesterId: userId1 }, { addresseeId: userId2 }],
            },
            {
              AND: [{ addresseeId: userId1 }, { requesterId: userId2 }],
            },
          ],
        },
      });
      if (!friendStatus) return null;
      if (friendStatus.status === 'ACCEPTED') {
        return friendStatus.status;
      }
      if (friendStatus.requesterId === userId2) {
        return 'PENDING';
      }
      return 'REQUESTED';
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getTargetInfo(
    activeUserId: string,
    targetUserId: string,
    res: Response,
  ) {
    try {
      console.log(targetUserId);
      const target: User = await this.findOne(targetUserId);
      const info: {
        id: string;
        nickname: string;
        avatarImg: string;
        eloScore: number;
        status: UserStatus;
        friendStatus: string;
      } = await this.getInfo(activeUserId, target.id);
      return res.status(200).send(info);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getUserFriends(userId: string, res: Response) {
    const friends = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        friendsRequester: {
          where: {
            status: 'ACCEPTED',
          },
          select: {
            addresseeId: true,
          },
        },
        friendsAddressee: {
          where: {
            status: 'ACCEPTED',
          },
          select: {
            requesterId: true,
          },
        },
      },
    });
    const friendsList = [];

    for (let i = 0; i < friends.friendsAddressee.length; i++) {
      friendsList.push(
        await this.getInfo(userId, friends.friendsAddressee[i].requesterId),
      );
    }
    for (let i = 0; i < friends.friendsRequester.length; i++) {
      friendsList.push(
        await this.getInfo(userId, friends.friendsRequester[i].addresseeId),
      );
    }
    return res.status(200).send(friendsList);
  }

  /**
   *
   *  2FA functions
   */

  async toggleTwoFactorAuthentication(
    secret: string,
    userId: string,
    res: Response,
  ) {
    try {
      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          twoFactorAuthenticationSecret: secret,
          twoFactorAuthenticationSet: false,
        },
      });
      return res.status(201).send();
    } catch (error) {
      console.log(error);
    }
    return;
  }

  async enableTwoFactorAuthentication(userId: string, res: Response) {
    try {
      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          twoFactorAuthenticationSet: true,
        },
      });
      return res.status(201).send();
    } catch (error) {
      console.log(error);
    }
    return;
  }

  /** Game management */

  async getUserMatches(userId: string, res: Response) {
    const matches = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        playerOneMatch: {},
        playerTwoMatch: {},
      },
    });
    const matchesList: Match[] = [];

    for (let i = 0; i < matches.playerOneMatch.length; i++) {
      matchesList.push(matches.playerOneMatch[i]);
    }
    for (let i = 0; i < matches.playerTwoMatch.length; i++) {
      matchesList.push(matches.playerTwoMatch[i]);
    }
    matchesList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return matchesList;
  }

  async getUserMatchesStats(userId: string, res: Response) {
    const stats: StatDto = { numberOfWin: 0, numberOfLoss: 0 };

    const matchesList = await this.getUserMatches(userId, res);
    for (let i = 0; i < matchesList.length; i++) {
      if (
        (matchesList[i].playerOneId === userId && matchesList[i].p1s === 10) ||
        (matchesList[i].playerTwoId === userId && matchesList[i].p2s === 10)
      )
        stats.numberOfWin++;
    }
    stats.numberOfLoss = matchesList.length - stats.numberOfWin;
    return res.status(200).send(stats);
  }
}
