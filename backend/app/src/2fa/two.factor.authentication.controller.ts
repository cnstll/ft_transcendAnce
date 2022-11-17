import {
  Body,
  Controller,
  Post,
  Res,
  Get,
  UnauthorizedException,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { TwoFactorAuthenticationService } from './two.factor.authentication.service';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guard/jwt.auth-guard';
import { GetCurrentUserId } from 'src/common/decorators/getCurrentUserId.decorator';
import { UserService } from 'src/user/user.service';
import { User } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import { TwoFaAuthGuard } from 'src/auth/guard/twoFa.auth-guard';

@Controller('2fa')
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  register(@GetCurrentUserId() userId: string, @Res() res: Response) {
    this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(
      userId,
      res,
    );
  }

  @Get('generate-qr-code')
  @UseGuards(JwtAuthGuard)
  generateQRCode(@GetCurrentUserId() userId: string) {
    return this.twoFactorAuthenticationService.generateQRCode(userId);
  }

  @Post('validate')
  @UseGuards(JwtAuthGuard)
  async validate(
    @GetCurrentUserId() userId: string,
    @Body() data: { twoFactorAuthenticationCode: string },
    @Res() res: Response,
  ) {
    /* Check that the user has a valid 2fa secret */
    const user: User = await this.userService.getUserInfo(userId);
    if (!user.twoFactorAuthenticationSecret)
      throw new UnauthorizedException('The user does not have a 2fa secret');

    const isCodeValid: boolean =
      await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        data.twoFactorAuthenticationCode,
        userId,
      );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    this.userService.enableTwoFactorAuthentication(userId, res);
    res.status(201).send();
  }

  @Post('authenticate')
  @UseGuards(TwoFaAuthGuard)
  async authenticate(
    @GetCurrentUserId() userId: string,
    @Body() data: { twoFactorAuthenticationCode: string },
    @Res() res: Response,
  ) {
    /* Check that the user has a valid 2fa secret */
    const user: User = await this.userService.getUserInfo(userId);
    if (!user.twoFactorAuthenticationSecret)
      throw new UnauthorizedException('The user does not have a 2fa secret');

    const isCodeValid: boolean =
      await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        data.twoFactorAuthenticationCode,
        userId,
      );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    const token = this.authService.login2FA(user);
    res.clearCookie('temporaryToken', { httpOnly: true });
    res.cookie('jwtToken', `${token}`, { httpOnly: true });
    res.status(201).send();
  }

  @Delete('disable')
  @UseGuards(JwtAuthGuard)
  toggle(@GetCurrentUserId() userId: string, @Res() res: Response) {
    return this.userService.toggleTwoFactorAuthentication('', userId, res);
  }
}
