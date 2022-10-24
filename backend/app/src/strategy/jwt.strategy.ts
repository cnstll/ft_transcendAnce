import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../auth/types';

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(jwtPayload: JwtPayload): Promise<JwtPayload> {
    return jwtPayload;
  }

  private static extractJWT(req: Request): string | null {
    if (
      req.cookies &&
      'jwtToken' in req.cookies &&
      req.cookies.jwtToken.length > 0
    ) {
      return req.cookies.jwtToken;
    } else {
      return null;
    }
  }
}
