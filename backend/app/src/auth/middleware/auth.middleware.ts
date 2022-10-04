import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    if (req.cookies['jwtToken'] === undefined) {
      next();
    } else {
      return res.redirect('http://localhost:3000/');
    }
  }
}
