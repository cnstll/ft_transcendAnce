import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

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

  async validate(payload: any): Promise<{ name: string; sub: string }> {
    return payload;
  }

  private static extractJWT(req: Request): string | null {
    console.log(process.env.JWT_SECRET);
    if (
      req.cookies &&
      'jwtToken' in req.cookies &&
      req.cookies.jwtToken.length > 0
    ) {
      console.log(req.cookies.jwtToken);
      return req.cookies.jwtToken;
    } else {
      return null;
    }
  }
}
