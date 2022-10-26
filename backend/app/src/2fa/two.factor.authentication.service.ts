import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { toFileStream } from 'qrcode';
import { User } from '@prisma/client';

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
    const user: User = await this.userService.getUserInfo(userId);

    let secret: string;
    if (!user.twoFactorAuthenticationSecret) {
      secret = authenticator.generateSecret();
      await this.userService.setTwoFactorAuthenticationSecret(
        secret,
        userId,
        res,
      );
    } else secret = user.twoFactorAuthenticationSecret;

    const otpauthUrl = authenticator.keyuri(
      userId,
      this.configService.get('TranscenDance'),
      secret,
    );
    return {
      secret,
      otpauthUrl,
    };
  }

  public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
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
