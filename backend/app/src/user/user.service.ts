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
          nickName: dto.nickName,
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

  async requestFriend(
    requesterId: string,
    futureFriendNickname: string,
    res: Response,
  ) {
    const futureFriend: User = await this.findOne(futureFriendNickname);
    try {
      console.log(requesterId, futureFriendNickname, futureFriend);
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

  async updateUserName(userId: string, newNickname: string) {
    try {
      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          nickName: newNickname,
        },
      });
    } catch (error) {
      console.log(error);
    }
    return;
  }

  async updateAvatarImg(userId: string, newAvatarImg: string) {
    try {
      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          avatarImg: newAvatarImg,
        },
      });
    } catch (error) {
      console.log(error);
    }
    return;
  }

  async updateFriendshipStatus(
    activeUserId: string,
    AffectedUserId: string,
    friends: boolean,
    res: Response,
  ) {
    if (friends === true) {
      this.addFriend(activeUserId, AffectedUserId, res);
    } else {
      this.deleteFriendship(activeUserId, AffectedUserId, res);
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

  findOne(username: string): Promise<User | undefined> {
    return this.prismaService.user.findUnique({
      where: {
        nickName: username.toString(),
      },
    });
  }
}
