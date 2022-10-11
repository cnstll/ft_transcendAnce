import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Profile } from 'passport';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  login(user: Profile) {
    const payload = {
      name: user.username,
      sub: user.id,
    };
    return this.jwtService.sign(payload);
  }

  async validateUser(details: any) {
    console.log('AuthService');
    console.log(details);
    let user = await this.userService.findOne('jescully');
    console.log(user);
    if (user) return user;
    console.log('User not found. Creating...');
    if (!user) {
      console.log('creating a user now');
      user = await this.prisma.user.create({
        data: {
          nickName: 'astring',
          passwordHash: 'hds',
        },
      });
    }
    return user;
  }

  public async loginIntra(userData: any, accessToken: string) {
    const user: User = await this.userService.findOne(userData.login);
    if (!user) {
      const data = {
        nickName: userData.login,
        passwordHash: accessToken,
      };
      this.userService.createUser(data);
    }
    return user;
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
