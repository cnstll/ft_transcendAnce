import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as QRCode from 'qrcode';

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
    return this.userService.toggleTwoFactorAuthentication(secret, userId, res);
  }

  public async generateQRCode(userId: string) {
    const user = await this.userService.getUserInfo(userId);
    console.log(user.twoFactorAuthenticationSecret);
    const otpauthURL = authenticator.keyuri(
      userId,
      this.configService.get('TranscenDance'),
      user.twoFactorAuthenticationSecret,
    );
    const qrCode = await QRCode.toDataURL(otpauthURL);
    return qrCode;
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
