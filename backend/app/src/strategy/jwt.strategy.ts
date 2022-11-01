import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../auth/types';

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        JwtStrategy.extractJWTfromHandshake,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(jwtPayload: JwtPayload): Promise<JwtPayload> {
    return jwtPayload;
  }

  private static extractJWTfromHandshake(req: any): string | null {
    // console.log('Extract extractJWTfromHandshake: ');
    // console.log(req);
    if (
      req.handshake &&
      req.handshake.headers.cookie &&
      req.handshake.headers.cookie.length > 0
    ) {
      const jwtToken = req.handshake.headers.cookie.split('=').pop();
      return jwtToken;
    } else {
      return null;
    }
  }

  private static extractJWT(req: Request): string | null {
    // console.log('Extract JWT: ');
    // console.log(req);
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
