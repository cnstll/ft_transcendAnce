import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
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

  logInUser(): void {
    return;
  }
  updateUser(): void {
    return;
  }

  // async requestFriend(requesterNickname: string, futureFriendNickname: string) {
  //   const requester: User = await this.findOne(requesterNickname);
  //   const futureFriend: User = await this.findOne(futureFriendNickname);
  //   try {
  //     const Friendship = await this.prismaService.friendship.create({
  //       data: {
  //         requester: requester,
  //         addressee: futureFriend
  //       },
  //     });

  //   } catch (error) {

  //   }

  //   return;
  // }

  findOne(username: string): Promise<User | undefined> {
    return this.prismaService.user.findUnique({
      where: {
        nickName: username.toString(),
      },
    });
  }

  fetchUser(): User | undefined {
    return undefined;
  }

  deleteUser(): void {
    return;
  }
}
