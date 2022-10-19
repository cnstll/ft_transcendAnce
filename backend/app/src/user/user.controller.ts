import {
  Put,
  Post,
  Controller,
  Get,
  Res,
  Body,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guard/jwt.auth-guard';
import { FriendDto } from './dto/friend.dto';
import { UserService } from './user.service';
import { GetCurrentUserId } from '../common/decorators/getCurrentUserId.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

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

  @Get('get-user-info')
  @UseGuards(JwtAuthGuard)
  getUserInfo(@Res() res: Response, @GetCurrentUserId() userId: string) {
    return this.userService.getUserInfo(userId, res);
  }

  @Get('get-user-friends')
  @UseGuards(JwtAuthGuard)
  getFriendsInfo(@Res() res: Response, @GetCurrentUserId() userId: string) {
    return this.userService.getUserFriends(userId, res);
  }

  @Post('get-target-info')
  @UseGuards(JwtAuthGuard)
  getOtherUserInfo(
    @Res() res: Response,
    @GetCurrentUserId() userId: string,
    @Body() target: { nickname: string },
  ) {
    console.log(target.nickname);
    return this.userService.getTargetInfo(userId, target.nickname, res);
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
