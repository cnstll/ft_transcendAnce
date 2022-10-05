import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class Api42OauthGuard extends AuthGuard('api42') {
  constructor() {
    super();
  }
}
