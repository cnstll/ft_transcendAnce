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
import { JwtPayload, UserRequest } from './types';
import { Api42OauthGuard } from './guard/api42.auth-guards';
import { Api42Filter } from './middleware/api.filter';
import { Response } from 'express';
import { UserDto } from 'src/user/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(Api42OauthGuard)
  @UseFilters(Api42Filter)
  @Get('/42/callback')
  async loginIntra(
    @Res() res: Response,
    @Req() req: UserRequest,
  ): Promise<void> {
    if (process.env.DOMAIN) {
      const url = new URL(process.env.DOMAIN);
      const token = this.authService.login(req.user);
      const url2FA = new URL(`${process.env.DOMAIN}/2fa-sign-in`);
      const user = req.user;
      if (user.twoFactorAuthenticationSet) {
        return res
          .cookie('temporaryToken', `${token}`, { httpOnly: true })
          .redirect(url2FA.toString());
      }
      res
        .cookie('jwtToken', `${token}`, { httpOnly: true })
        .redirect(url.toString());
    }
  }

  @Post('/login-user-dev')
  async loginUserDev(@Res() res: Response, @Body() req: JwtPayload) {
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
  async create_user_dev(@Res() res: Response, @Body() req: UserDto) {
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
