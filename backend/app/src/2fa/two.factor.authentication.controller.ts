import {
  Body,
  Controller,
  Post,
  Put,
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
import { User } from '@prisma/client';

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
    res.status(201).send();
  }

  @Post('authenticate')
  @UseGuards(JwtAuthGuard)
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
    this.authService.loginWith2fa(user);
    res.status(201).send();
  }

  @Put('toggle')
  @UseGuards(JwtAuthGuard)
  toggle(
    @GetCurrentUserId() userId: string,
    @Body() data: { toggleState: boolean },
    @Res() res: Response,
  ) {
    this.userService.toggleTwoFactorAuthentication(
      userId,
      data.toggleState,
      res,
    );
  }
}
