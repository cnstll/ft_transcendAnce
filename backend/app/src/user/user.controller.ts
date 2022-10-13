import { Body, Controller, Get, Put, Query, Req, Res } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('create')
  createUser(@Query('name') name: string) {
    const dto = new UserDto();
    dto['name'] = name;
    return this.userService.createUser(dto);
  }

  @Put('update-nickname')
  updateUserName(@Res() res: any, @Req() req: any, @Body() data: any) {
    return this.userService.updateUserName(data.old, data.new, res);
  }
}
