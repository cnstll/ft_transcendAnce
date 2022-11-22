import {
  Controller,
  Post,
  Get,
  Req,
  Res,
  UseGuards,
  Body,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtPayload } from './types';
import { Api42OauthGuard } from './guard/api42.auth-guards';
import { Api42Filter } from './middleware/api.filter';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(Api42OauthGuard)
  @UseFilters(Api42Filter)
  @Get('/42/callback')
  async loginIntra(@Res() res, @Req() req): Promise<void> {
    const url = new URL(process.env.DOMAIN);
    const url2FA = new URL(`${process.env.DOMAIN}/2fa-sign-in`);
    const token = this.authService.login(req.user);
    const user = req.user;
    if (user.twoFactorAuthenticationSet) {
      return res
        .cookie('temporaryToken', `${token}`, { httpOnly: true })
        .redirect(url2FA);
    }
    res.cookie('jwtToken', `${token}`, { httpOnly: true }).redirect(url);
  }

  @Post('/login-user-dev')
  async loginUserDev(@Res() res, @Body() req) {
    const jwtPayload: JwtPayload = {
      id: req.id,
      immutableId: req.immutableId,
      nickname: req.nickname,
      isTwoFactorSet: false,
    };
    const token = this.authService.login(jwtPayload);
    res.status(201).send(token);
  }

  @Post('/create-user-dev')
  async create_user_dev(@Res() res, @Body() req) {
    const user = await this.authService.create_user_dev(req);
    if (!user) {
      res.status(304).send();
      return;
    }
    const jwtPayload = {
      id: user.id,
      immutableId: user.immutableId,
      nickname: user.nickname,
    };
    const token = this.authService.login(jwtPayload);
    res.status(201).send(token);
  }
}
