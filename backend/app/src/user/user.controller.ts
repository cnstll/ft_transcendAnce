import {
  Put,
  Post,
  Controller,
  Get,
  Query,
  Res,
  Body,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt.auth-guard';
import { FriendDto } from './dto/friend.dto';
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

  @Post('request-friend')
  createFriendship(@Res() res: any, @Body() data: FriendDto) {
    this.userService.requestFriend(data.requester, data.addressee),
      res.status(201).send();
  }
  @Put('update-friendship')
  @UseGuards(JwtAuthGuard)
  acceptFriendship(@Res() res: any, @Req() req: any, @Body() data: FriendDto) {
    console.log(req.user);
    this.userService.acceptFriend(data.requester, data.addressee),
      res.status(200).send();
  }

  @Put('update-nickname')
  @UseGuards(JwtAuthGuard)
  updateUserName(@Res() res: any, @Req() req: any, @Body() data: any) {
    console.log(req.user);
    if (data.old == req.user.nickName) {
      this.userService.updateUserName(data.old, data.new);
      return res.status(200).send();
    }
    return res.status(401).send();
  }

  @Delete('delete')
  async deleteUser(@Res() res: any, @Body() data: any) {
    await this.userService.deleteUser(data.nickName);
    res.status(204).send();
  }
}
