import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class TwoFactorAuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  public async generateTwoFactorAuthenticationSecret(
    userId: string,
    res: Response,
  ) {
    const secret: string = authenticator.generateSecret();
    await this.userService.setTwoFactorAuthenticationSecret(
      secret,
      userId,
      res,
    );
  }

  public async generateQRCode(userId: string) {
    const user = await this.userService.getUserInfo(userId);
    const otpauthUrl = authenticator.keyuri(
      userId,
      this.configService.get('TranscenDance'),
      user.twoFactorAuthenticationSecret,
    );
    return otpauthUrl;
  }

  async isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    userId: string,
  ) {
    const user = await this.userService.getUserInfo(userId);
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.twoFactorAuthenticationSecret,
    });
  }
}
