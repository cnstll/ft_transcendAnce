import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
// import { Profile } from 'passport';
import { AuthService } from './auth.service';
import { Api42OauthGuard } from './guard/api42.auth-guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }
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

  @Get('signin')
  @UseGuards(Api42OauthGuard)
  login(): void {
    return;
  }

  @UseGuards(Api42OauthGuard)
  @Get('/42/callback')
  loginIntra(@Res() res, @Req() req): any {
    const url = new URL('http://localhost:8080/profile');
    const token = this.authService.login(req.user);
    res.cookie('jwtToken', `${token}`, { httpOnly: true }).redirect(url);
  }
}
