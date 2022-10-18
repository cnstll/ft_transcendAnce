import {
  Controller,
  Post,
  Get,
  Req,
  Res,
  UseGuards,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Payload } from './types';
import { Api42OauthGuard } from './guard/api42.auth-guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(Api42OauthGuard)
  @Get('/42/callback')
  async loginIntra(@Res() res, @Req() req): Promise<void> {
    const url = new URL('http://localhost:8080/');
    const token = this.authService.login(req.user);
    res.cookie('jwtToken', `${token}`, { httpOnly: true }).redirect(url);
  }

  @Post('/login-user-dev')
  async loginUserDev(@Res() res, @Body() req) {
    const payload: Payload = {
      userId: req.id,
      nickName: req.nickname,
    };
    const token = this.authService.login(payload);
    res.status(201).send(token);
  }

  @Post('/create-user-dev')
  async create_user_dev(@Res() res, @Body() req) {
    const user = await this.authService.create_user_dev(req);
    if (!user) {
      res.status(304).send();
      return;
    }
    const payload = {
      userId: user.id,
      nickName: user.nickName,
    };
    const token = this.authService.login(payload);
    res.status(201).send(token);
  }
}
