import {
  Body,
  Controller,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { TwoFactorAuthenticationService } from './two.factor.authentication.service';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guard/jwt.auth-guard';
import { GetCurrentUserId } from 'src/common/decorators/getCurrentUserId.decorator';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';

@Controller('2fa')
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async register(@GetCurrentUserId() userId: string, @Res() res: Response) {
    const { otpauthUrl } =
      await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(
        userId,
        res,
      );

    return this.twoFactorAuthenticationService.pipeQrCodeStream(
      res,
      otpauthUrl,
    );
  }

  @Post('disable')
  @UseGuards(JwtAuthGuard)
  disable(@GetCurrentUserId() userId: string, @Res() res: Response) {
    this.userService.disableTwoFactorAuthentication(userId, res);
  }

  @Post('authenticate')
  @UseGuards(JwtAuthGuard)
  async authenticate(
    @GetCurrentUserId() userId: string,
    @Body() data: { twoFactorAuthenticationCode: string },
    @Res() res: Response,
  ) {
    const isCodeValid: boolean =
      await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        data.twoFactorAuthenticationCode,
        userId,
      );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    return res.status(200).send();
  }
}
