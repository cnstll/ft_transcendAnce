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
import { TwoFactorAuthenticationDto } from './dto/two.factor.authentication.dto';

@Controller('2fa')
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private readonly userService: UserService,
  ) {}

  // @Post('generate')
  // @UseGuards(JwtAuthGuard)
  // async register(@GetCurrentUserId() userId: string, @Res() res: Response) {
  //   const { otpauthUrl } =
  //     await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(
  //       userId,
  //       res,
  //     );

  //   return this.twoFactorAuthenticationService.pipeQrCodeStream(
  //     res.setHeader('content-type', 'image/png'),
  //     otpauthUrl,
  //   );
  // }

  @Post('turn-on')
  @UseGuards(JwtAuthGuard)
  turnOnTwoFactorAuthentication(
    @GetCurrentUserId() userId: string,
    @Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationDto,
    @Res() res: Response,
  ) {
    const isCodeValid =
      this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode,
        userId,
      );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(
      userId,
      res,
    );
    return res.status(200).send();
  }
}
