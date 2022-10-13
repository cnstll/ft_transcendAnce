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
import { Api42OauthGuard } from './guard/api42.auth-guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(Api42OauthGuard)
  @Get('/42/callback')
  async loginIntra(@Res() res, @Req() req): Promise<void> {
    const url = new URL('http://localhost:8080/profile');
    const token = this.authService.login(req.user);
    res.cookie('jwtToken', `${token}`, { httpOnly: true }).redirect(url);
  }

  @Post('/create-user-dev')
  async create_user_dev(@Res() res, @Body() req) {
    const user = await this.authService.create_user_dev(req);
    if (user) {
      res.status(201).send();
    } else {
      res.status(304).send();
    }
  }
}
