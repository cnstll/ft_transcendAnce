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
import { Response } from 'express';
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
  createFriendship(
    @Req() req: any,
    @Res() res: Response,
    @Body() data: FriendDto,
  ) {
    return this.userService.requestFriend(req.user.userId, data.target, res);
  }

  @Put('update-friendship')
  @UseGuards(JwtAuthGuard)
  acceptFriendship(
    @Res() res: Response,
    @Req() req: any,
    @Body() data: FriendDto,
  ) {
    return this.userService.updateFriendshipStatus(
      req.user.userId,
      data.target,
      data.friends,
      res,
    );
  }

  @Put('update-nickname')
  @UseGuards(JwtAuthGuard)
  updateUserName(
    @Res() res: Response,
    @Req() req: any,
    @Body() data: { newNickname: string },
  ) {
    this.userService.updateUserName(req.user.userId, data.newNickname);
    return res.status(200).send();
  }

  @Delete('delete')
  async deleteUser(@Res() res: Response, @Body() data: { nickName: string }) {
    await this.userService.deleteUser(data.nickName);
    res.status(204).send();
  }
}
