import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { Profile } from 'passport';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Api42OauthGuard } from './guard/api42.auth-guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('create')
  signup(@Body() dto: AuthDto) {
    return this.authService.userCreate(dto);
  }

  @Get('test-env')
  testEnvVars(@Res() response: Response): Response<any> {
    response.json({
      authorizationURL: process.env.API_AUTHORIZATION_URL,
      tokenURL: process.env.API_TOKEN_URL,
      clientID: process.env.API_UID,
      clientSecret: process.env.API_SECRET,
      callbackURL: process.env.API_REDIRECT_URI,
      apiURI: process.env.API_URI,
      scope: 'public',
    });
    return response;
  }

  @UseGuards(Api42OauthGuard)
  @Get('signin')
  login(): void {
    return;
  }

  @UseGuards(Api42OauthGuard)
  @Get('redirect')
  async api42Redirect(@Req() req: any, @Res() res: Response): Promise<void> {
    const {
      user,
      authInfo,
    }: {
      user: Profile;
      authInfo: {
        accessToken: string;
        refreshToken: string;
        results: object;
      };
    } = req;

    const userData = await this.authService.retrieveProfileData(
      authInfo.accessToken,
    );
    const jwt = this.authService.login(userData);
    return res.cookie('jwtToken', `${jwt}`).redirect('/');
  }
}
