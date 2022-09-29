import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Profile } from 'passport';
import { PrismaService } from '../prisma/prisma.service';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
  ) {}

  login(user: Profile) {
    const payload = {
      name: user.username,
      sub: user.id,
    };
    return this.jwtService.sign(payload);
  }

  async userCreate(dto: AuthDto) {
    const user = await this.prisma.users.create({
      data: {
        nickName: dto.name.toString(),
      },
    });
    return user;
  }
  async retrieveProfileData(accessToken: string): Promise<any> {
    const req = this.httpService.get('https://api.intra.42.fr/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    let profile = await lastValueFrom(req);
    const tailoredProfile = {
      provider: 'api42',
      id: profile.data.id.toString(),
      displayName: profile.data.displayname,
      username: profile.data.login,
    };
    return tailoredProfile;
  }
}
