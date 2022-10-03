import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { Api42Strategy } from '../strategy/api42.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../strategy/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, Api42Strategy, JwtStrategy],
  imports: [
    HttpModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: '3600s',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule { }
