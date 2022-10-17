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
import { GetCurrentUserId } from '../common/decorators/getCurrentUserId.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post('create')
  createUser(@Query('name') name: string, @Res() res: any) {
    const dto = new UserDto();
    dto['name'] = name;
    res.status(201).send();
    return this.userService.createUser(dto);
  }

  @Get('get-user-info')
  @UseGuards(JwtAuthGuard)
  getUserInfo(@Res() res: Response, @GetCurrentUserId() userId: string) {
    return this.userService.getUserInfo(userId, res);
  }

  @Get('fetch-user')
  @UseGuards(JwtAuthGuard)
  async fetchUser(@Req() req: any, @Res() res: any) {
    const user = await this.userService.findOne(req.user.nickName);
    return res.status(200).json(user);
  }

  @Post('request-friend')
  @UseGuards(JwtAuthGuard)
  createFriendship(
    @GetCurrentUserId() userId: string,
    @Res() res: Response,
    @Body() data: FriendDto,
  ) {
    return this.userService.requestFriend(userId, data.target, res);
  }

  @Put('update-friendship')
  @UseGuards(JwtAuthGuard)
  acceptFriendship(
    @Res() res: Response,
    @GetCurrentUserId() userId: string,
    @Body() data: FriendDto,
  ) {
    return this.userService.updateFriendshipStatus(
      userId,
      data.target,
      data.friends,
      res,
    );
  }

  @Put('update-avatarImg')
  @UseGuards(JwtAuthGuard)
  updateAvatarImg(
    @Res() res: Response,
    @GetCurrentUserId() userId: string,
    @Body() data: { newAvatarImg: string },
  ) {
    this.userService.updateUserName(userId, data.newAvatarImg, res);
    return res.status(200).send();
  }

  @Get('get-user-friends')
  @UseGuards(JwtAuthGuard)
  getFriendsInfo(@Res() res: Response, @GetCurrentUserId() userId: string) {
    return this.userService.getUserFriends(userId, res);
  }

  @Get('get-user-friend-requests')
  @UseGuards(JwtAuthGuard)
  getFriendRequests(@Res() res: Response, @GetCurrentUserId() userId: string) {
    return this.userService.getUserFriendRequests(userId, res);
  }

  @Put('update-nickname')
  @UseGuards(JwtAuthGuard)
  updateUserName(
    @Res() res: Response,
    @GetCurrentUserId() userId: string,
    @Body() data: { newNickname: string },
  ) {
    this.userService.updateUserName(userId, data.newNickname, res);
    return res.status(200).send();
  }

  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Res() res: Response, @GetCurrentUserId() userId: string) {
    return await this.userService.deleteUser(userId, res);
  }
}
