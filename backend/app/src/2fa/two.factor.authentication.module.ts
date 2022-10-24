import { Module } from '@nestjs/common';
import { TwoFactorAuthenticationController } from './two.factor.authentication.controller';
import { TwoFactorAuthenticationService } from './two.factor.authentication.service';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [TwoFactorAuthenticationController],
  providers: [TwoFactorAuthenticationService],
  exports: [TwoFactorAuthenticationService],
  imports: [UserModule],
})
export class TwoFactorAuthenticationModule {}
