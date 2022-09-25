import { Body, Controller, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }
  @Post('create')
  signup(@Body() dto: AuthDto) {
    return this.authService.userCreate(dto);
  };
}
