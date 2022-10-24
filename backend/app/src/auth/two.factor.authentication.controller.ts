import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  Res,
  UseGuards,
} from '@nestjs/common';
import { TwoFactorAuthenticationService } from './two.factor.authentication.service';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guard/jwt.auth-guard';
import { GetCurrentUserId } from 'src/common/decorators/getCurrentUserId.decorator';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
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
}
