import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { HandshakeRequest, JwtRequest } from 'src/pong/entities/game.entities';
import { JwtPayload } from '../auth/types';

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: JwtRequest) => {
          if (
            req.cookies !== undefined &&
            req.cookies.jwtToken &&
            req.cookies.jwtToken.length > 0
          ) {
            return req.cookies.jwtToken;
          } else {
            return null;
          }
        },
        (req: HandshakeRequest) => {
          if (
            req.handshake?.headers.cookie &&
            req.handshake.headers.cookie.length > 0
          ) {
            const jwtToken = req.handshake.headers.cookie.split('=').pop();
            if (jwtToken) return jwtToken;
            return null;
          } else {
            return null;
          }
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(jwtPayload: JwtPayload): Promise<JwtPayload> {
    return jwtPayload;
  }
}
