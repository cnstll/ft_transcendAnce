import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Strategy } from 'passport-42';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class Api42Strategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private httpService: HttpService,
  ) {
    super({
      clientID: process.env.API_UID,
      clientSecret: process.env.API_SECRET,
      callbackURL: process.env.API_URI,
    });
  }
  async validate(accessToken: string): Promise<any> {
    const { data } = await lastValueFrom(
      this.httpService.get('https://api.intra.42.fr/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    );
    return this.authService.loginIntra(data, accessToken);
  }
}
