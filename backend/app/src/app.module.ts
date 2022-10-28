import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ChannelModule } from './channel/channel.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { TwoFactorAuthenticationModule } from './2fa/two.factor.authentication.module';

@Module({
  imports: [
    AuthModule,
    ChannelModule,
    ConfigModule.forRoot({
      envFilePath: '.env.dev',
      isGlobal: true,
    }),
    PrismaModule,
    UserModule,
    TwoFactorAuthenticationModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
