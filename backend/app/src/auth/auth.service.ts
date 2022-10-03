import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async userCreate(dto: AuthDto) {
    const user = await this.prisma.user.create({
      data: {
        nickName: dto.name.toString(),
        passwordHash: 'ahash',
      },
    });
    return user;
  }
}
