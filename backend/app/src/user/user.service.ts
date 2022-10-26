import { ForbiddenException, Injectable } from '@nestjs/common';
import { User, FriendshipStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Response } from 'express';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

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
      const nicknames = await this.prismaService.user.findMany({
        select: {
          nickname: true,
        },
      });
      return res.status(200).send(nicknames);
    } catch (error) {
      console.log(error);

      return res.status(500).send();
    }
  }

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
    const target: User = await this.findOne(targetUserId);
    return res.status(200).send(await this.getInfo(activeUserId, target.id));
  }

  async getInfo(userId: string, userId1: string) {
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

  async getUserInfo(userId: string): Promise<User | undefined> {
    const user: User = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user;
  }

  findOne(immutableId: string): Promise<User | undefined> {
    return this.prismaService.user.findUnique({
      where: {
        immutableId: immutableId,
      },
    });
  }

  logout(res: Response) {
    return res.cookie('jwtToken', '', { httpOnly: true });
  }

  /**
   *
   *  2FA functions
   */

  async setTwoFactorAuthenticationSecret(
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
          twoFactorAuthenticationSet: true,
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

  async disableTwoFactorAuthentication(userId: string, res: Response) {
    try {
      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          twoFactorAuthenticationSet: false,
        },
      });
      return res.status(201).send();
    } catch (error) {
      console.log(error);
    }
    return;
  }
}
