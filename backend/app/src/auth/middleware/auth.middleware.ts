import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtRequest } from 'src/pong/entities/game.entities';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  use(req: JwtRequest, next: () => void) {
    try {
      this.jwtService.verify(req.cookies.jwtToken);
      next();
    } catch (error) {
      next();
    }
  }
}
