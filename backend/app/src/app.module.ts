import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './pong/game.module';
import { ChannelModule } from './channel/channel.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { TwoFactorAuthenticationModule } from './2fa/two.factor.authentication.module';
import { UserGateway } from './user/user.gateway';

@Module({
  imports: [
    AuthModule,
    ChannelModule,
    ConfigModule.forRoot({
      envFilePath: process.env.ENV_FILE_PATH,
      isGlobal: true,
    }),
    PrismaModule,
    UserModule,
    TwoFactorAuthenticationModule,
    GameModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [UserGateway],
})
export class AppModule {
  void;
}
