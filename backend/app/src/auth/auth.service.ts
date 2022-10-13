import { ConsoleLogger, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Profile } from 'passport';
import { User } from '@prisma/client';
import { UserService } from '../user/user.service';
import { HttpService } from '@nestjs/axios';
import { UserDto } from '../user/dto/user.dto';
import { AuthDto, PayloadDto } from './dto';
import { lastValueFrom } from 'rxjs';

@Injectable({})
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private httpService: HttpService,
  ) {}

  login(user: PayloadDto) {
    const payload = {
      userId: user.id,
      nickName: user.nickName,
    };
    return this.jwtService.sign(payload);
  }

  public async loginIntra(userData: AuthDto, accessToken: string) {
    const user: User = await this.userService.findOne(userData.login);
    if (!user) {
      const data = {
        nickName: userData.login,
        passwordHash: accessToken,
        avatarImg: userData.image_url,
      };
      return this.userService.createUser(data);
    }
    return user;
  }

  public async create_user_dev(userData: UserDto) {
    const user: User = await this.userService.findOne(userData.nickName);
    if (!user) {
      const data = {
        nickName: userData.nickName,
        passwordHash: userData.passwordHash,
        avatarImg: userData.avatarImg,
      };
      return await this.userService.createUser(data);
    } else {
      return;
    }
  }

  async retrieveProfileData(accessToken: string): Promise<any> {
    const req = this.httpService.get('https://api.intra.42.fr/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const profile = await lastValueFrom(req);
    const tailoredProfile = {
      provider: 'api42',
      id: profile.data.id.toString(),
      displayName: profile.data.displayname,
      username: profile.data.login,
    };
    return tailoredProfile;
  }
}
