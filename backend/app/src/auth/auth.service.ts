import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Profile } from 'passport';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable({})
export class AuthService {
  constructor(
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

  public async loginIntra(userData: any, accessToken: string) {
    const user: User = await this.userService.findOne(userData.login);
    if (!user) {
      const data = {
        nickName: userData.login,
        passwordHash: accessToken,
      };
      return this.userService.createUser(data);
    }
    return user;
  }
  // We will need a function like this later but it is not of use yet
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
