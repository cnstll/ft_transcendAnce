import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class TwoFaAuthGuard extends AuthGuard('jwt-two-factor') {}
