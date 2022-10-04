import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-oauth2';
import { AuthService } from '../auth/auth.service';
import { Profile } from 'passport';
import { StatSyncFn } from 'fs';

@Injectable()
export class Api42Strategy extends PassportStrategy(Strategy, 'api42') {
  constructor(private authService: AuthService) {
    super(
      {
        clientID: process.env.API_UID,
        callbackURL: process.env.API_URI,
        tokenURL: process.env.API_TOKEN_URL,
        authorizationURL: process.env.API_AUTHORIZATION_URL,
        clientSecret: process.env.API_SECRET,
      },
      (
        accessToken: string,
        refreshToken: string,
        results: object,
        profile: Profile,
        done: VerifyCallback,
      ) => {
        return done(null, profile, {
          accessToken,
          refreshToken,
          results,
        });
      },
    );
  }
  async validate(accessToken: string): Promise<any> {
    return this.authService.retrieveProfileData(accessToken);
  }
}
