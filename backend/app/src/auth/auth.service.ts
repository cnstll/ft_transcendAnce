import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto';
import { UserDto } from 'src/user/dto/user.dto';
import { JwtPayload, UserPayload } from './types/';

@Injectable({})
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService, // private httpService: HttpService,
  ) {}

  login(user: UserPayload) {
    const jwtPayload: JwtPayload = {
      id: user.id,
      immutableId: user.immutableId,
      nickname: user.nickname,
      isTwoFactorSet: false,
    };
    return this.jwtService.sign(jwtPayload);
  }

  login2FA(user: UserPayload) {
    const jwtPayload: JwtPayload = {
      id: user.id,
      immutableId: user.immutableId,
      nickname: user.nickname,
      isTwoFactorSet: true,
    };
    return this.jwtService.sign(jwtPayload);
  }

  public async loginIntra(userData: AuthDto) {
    const user: User | null = await this.userService.findOneFromImmutableId(
      userData.id.toString(),
    );
    if (!user) {
      const data = {
        nickname: userData.login,
        immutableId: userData.id.toString(),
        avatarImg: userData.image.link,
      };
      return await this.userService.createUser(data);
    }
    return user;
  }

  public async create_user_dev(userData: UserDto) {
    const user: User | null = await this.userService.findOneFromUserNickname(
      userData.nickname,
    );
    if (!user) {
      const data = {
        nickname: userData.nickname,
        immutableId: userData.immutableId,
        avatarImg: userData.avatarImg,
      };
      return await this.userService.createUser(data);
    } else {
      return;
    }
  }
}
