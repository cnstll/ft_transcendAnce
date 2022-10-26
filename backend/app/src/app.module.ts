import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { TwoFactorAuthenticationModule } from './2fa/two.factor.authentication.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.dev',
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    UserModule,
    TwoFactorAuthenticationModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
