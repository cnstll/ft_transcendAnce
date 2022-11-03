import { Module } from '@nestjs/common';
import { TwoFactorAuthenticationController } from './two.factor.authentication.controller';
import { TwoFactorAuthenticationService } from './two.factor.authentication.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [TwoFactorAuthenticationController],
  providers: [TwoFactorAuthenticationService],
  exports: [TwoFactorAuthenticationService],
  imports: [UserModule, AuthModule],
})
export class TwoFactorAuthenticationModule {}
