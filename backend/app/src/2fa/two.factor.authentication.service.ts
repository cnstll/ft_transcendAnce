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
    try {
      const secret: string = authenticator.generateSecret();
      await this.userService.toggleTwoFactorAuthentication(secret, userId);
      const otpauthURL = authenticator.keyuri(
        userId,
        this.configService.get('TranscenDance'),
        secret,
      );
      const qrCode = await QRCode.toDataURL(otpauthURL);
      return res.status(201).send(qrCode);
    } catch (error) {
      console.log(error);
      return res.status(500).send();
    }
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
