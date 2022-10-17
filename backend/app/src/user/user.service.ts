import { ForbiddenException, Injectable } from '@nestjs/common';
import { User, FriendshipStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

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

  async deleteUser(userNickname: string) {
    try {
      await this.prismaService.user.delete({
        where: {
          nickName: userNickname,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  logInUser(): void {
    return;
  }
  updateUser(): void {
    return;
  }

  async requestFriend(requesterId: string, futureFriendNickname: string) {
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
    }
    return;
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

  async acceptFriend(requesterNickname: string, addresseeId: string) {
    const status: FriendshipStatus = 'ACCEPTED';
    const requester: User = await this.findOne(requesterNickname);
    try {
      await this.prismaService.user.update({
        where: {
          id: addresseeId,
        },
        data: {
          friendsAddressee: {
            update: {
              where: {
                friendshipId: {
                  requesterId: requester.id,
                  addresseeId: addresseeId,
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
      return;
    }
  }

  findOne(username: string): Promise<User | undefined> {
    return this.prismaService.user.findUnique({
      where: {
        nickName: username.toString(),
      },
    });
  }
}
