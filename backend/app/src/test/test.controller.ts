import {
  // Body,
  Controller,
  // HttpCode,
  // HttpStatus,
  Post,
  // Req,
} from '@nestjs/common';
import { TestService } from './test.service';
// import { AuthDto } from './dto';

@Controller('test')
export class TestController {
  constructor(private testService: TestService) {}

  @Post('signup')
  signup() {
    // signup(@Body() dto: AuthDto) {
    // return this.authService.signup(dto);
    return 'i am signing up';
  }

  // @HttpCode(HttpStatus.OK)
  // @Post('signin')
  // signin(@Body() dto: AuthDto) {
  //   return this.authService.signin(dto);
  // }
}
