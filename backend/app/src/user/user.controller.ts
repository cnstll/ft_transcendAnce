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
  @UseGuards(JwtAuthGuard)
  createFriendship(@Req() req: any, @Res() res: any, @Body() data: FriendDto) {
    this.userService.requestFriend(req.user.userId, data.addressee),
      res.status(201).send();
  }

  @Put('update-friendship')
  @UseGuards(JwtAuthGuard)
  acceptFriendship(@Res() res: any, @Req() req: any, @Body() data: FriendDto) {
    this.userService.acceptFriend(data.requester, req.user.userId),
      res.status(200).send();
  }

  @Put('update-nickname')
  @UseGuards(JwtAuthGuard)
  updateUserName(@Res() res: any, @Req() req: any, @Body() data: any) {
    this.userService.updateUserName(req.user.userId, data.newNickname);
    return res.status(200).send();
  }

  @Delete('delete')
  async deleteUser(@Res() res: any, @Body() data: any) {
    await this.userService.deleteUser(data.nickName);
    res.status(204).send();
  }
}
