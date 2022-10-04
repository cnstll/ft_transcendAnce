import { ForbiddenException, Injectable } from '@nestjs/common';
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
          nickName: dto.name,
          passwordHash: 'very-secure-password',
        },
      });
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

  deleteUser(): void {
    return;
  }
}
