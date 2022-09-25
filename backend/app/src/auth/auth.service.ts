import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) { }

  async userCreate(dto: AuthDto) {
    const user = await this.prisma.users.create({
      data: {
        nickName: dto.name.toString(),
      }
    })
    return user;
  };
}
