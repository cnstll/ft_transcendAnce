import { PassportStrategy } from '@nestjs/passport';
// import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TwoFaRequest } from 'src/pong/entities/game.entities';
import { JwtPayload } from '../auth/types';

export class TwoFaStrategy extends PassportStrategy(
  Strategy,
  'jwt-two-factor',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: TwoFaRequest) => {
          if (
            'temporaryToken' in req.cookies &&
            req.cookies.temporaryToken.length > 0
          ) {
            return req.cookies.temporaryToken;
          } else {
            return null;
          }
        },
        // TwoFaStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(jwtPayload: JwtPayload): Promise<JwtPayload> {
    return jwtPayload;
  }

  // private static extractJWT(req: Request): string | null {
  //   if (
  //     req.cookies &&
  //     'temporaryToken' in req.cookies &&
  //     req.cookies.temporaryToken.length > 0
  //   ) {
  //     return req.cookies?.temporaryToken;
  //   } else {
  //     return null;
  //   }
  // }
}
