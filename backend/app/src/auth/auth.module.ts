import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { Api42Strategy } from '../strategy/api42.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../strategy/jwt.strategy';
import { AuthMiddleware } from './middleware/auth.middleware';
import { UserModule } from '../user/user.module';
import { TwoFaStrategy } from 'src/strategy/2fa.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    Api42Strategy,
    JwtStrategy,
    TwoFaStrategy,
    AuthMiddleware,
  ],
  exports: [AuthService, JwtStrategy, Api42Strategy, TwoFaStrategy],
  imports: [
    HttpModule,
    PassportModule,
    UserModule,
    JwtModule.registerAsync({
      useFactory: async () => {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: '3600m',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('auth/42');
  }
}
