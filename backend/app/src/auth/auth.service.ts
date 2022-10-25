import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from '../user/user.service';
// import { HttpService } from '@nestjs/axios';
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
      nickname: user.nickname,
      twoFactorAuthentication: false,
    };
    return this.jwtService.sign(jwtPayload);
  }

  public async loginIntra(userData: AuthDto, accessToken: string) {
    const user: User = await this.userService.findOne(userData.login);
    if (!user) {
      const data = {
        nickname: userData.login,
        passwordHash: accessToken,
        avatarImg: userData.image_url,
      };
      return await this.userService.createUser(data);
    }
    return user;
  }

  public async create_user_dev(userData: UserDto) {
    const user: User = await this.userService.findOne(userData.nickname);
    if (!user) {
      const data = {
        nickname: userData.nickname,
        passwordHash: userData.passwordHash,
        avatarImg: userData.avatarImg,
      };
      return await this.userService.createUser(data);
    } else {
      return;
    }
  }

  // async retrieveProfileData(accessToken: string): Promise<any> {
  //   const req = this.httpService.get('https://api.intra.42.fr/v2/me', {
  //     headers: { Authorization: `Bearer ${accessToken}` },
  //   });
  //   const profile = await lastValueFrom(req);
  //   const tailoredProfile = {
  //     provider: 'api42',
  //     id: profile.data.id.toString(),
  //     displayName: profile.data.displayname,
  //     username: profile.data.login,
  //   };
  //   return tailoredProfile;
  // }
}
