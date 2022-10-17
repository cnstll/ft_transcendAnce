import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  use(req: Request, res: Response, next: () => void) {
    try {
      this.jwtService.verify(req.cookies['jwtToken']);
      next();
    } catch (error) {
      console.log(error);
      next();
    }
  }
}
