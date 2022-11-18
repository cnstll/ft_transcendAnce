import {
  Put,
  Post,
  Controller,
  Get,
  Res,
  Body,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Param,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guard/jwt.auth-guard';
import { FriendDto } from './dto/friend.dto';
import { UserService } from './user.service';
import { GetCurrentUserId } from '../common/decorators/getCurrentUserId.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path = require('path');

export const storage = {
  storage: diskStorage({
    destination: './avatar',
    filename: (req, file, cb) => {
      const filename: string = path
        .parse(file.originalname)
        .name.replace(/\s/g, '');
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  /** User management */

  @Get('get-user-info')
  @UseGuards(JwtAuthGuard)
  getUserInfo(@GetCurrentUserId() userId: string) {
    return this.userService.getUserInfo(userId);
  }

  @Post('get-user-by-id')
  @UseGuards(JwtAuthGuard)
  getUserById(@Body() data: { userId: string }) {
    return this.userService.getUserInfo(data.userId);
  }

  @Get('get-all-users')
  @UseGuards(JwtAuthGuard)
  getAllUsers(@Res() res: Response) {
    return this.userService.getAllUsers(res);
  }

  @Put('update-avatarImg')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', storage))
  updateAvatar(
    @UploadedFile() file,
    @Res() res: Response,
    @GetCurrentUserId() userId: string,
  ) {
    const filename = `${process.env.PUBLIC_URL}/user/` + file.path;
    this.userService.updateAvatarImg(userId, filename, res);
    return res.status(200).send();
  }
  @Get('avatar/:fileId')
  async serveAvatar(@Param('fileId') fileId, @Res() res): Promise<void> {
    res.sendFile(fileId, { root: 'avatar' });
  }

  @Put('update-nickname')
  @UseGuards(JwtAuthGuard)
  updateUserName(
    @Res() res: Response,
    @GetCurrentUserId() userId: string,
    @Body() data: { newNickname: string },
  ) {
    return this.userService.updateUserName(userId, data.newNickname, res);
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Res() res: Response) {
    this.userService.logout(res);
    return res.status(200).send();
  }

  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Res() res: Response, @GetCurrentUserId() userId: string) {
    return await this.userService.deleteUser(userId, res);
  }

  /** Friendship management */

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
    return this.userService.getTargetInfo(userId, target.nickname, res);
  }

  @Get('get-user-friend-requests')
  @UseGuards(JwtAuthGuard)
  getFriendRequests(@Res() res: Response, @GetCurrentUserId() userId: string) {
    return this.userService.getUserFriendRequests(userId, res);
  }

  /** Match management */

  @Post('get-user-matches-stats')
  @UseGuards(JwtAuthGuard)
  getUserMatchesStats(
    @Res() res: Response,
    @Body() target: { userNickname: string },
  ) {
    return this.userService.getUserMatchesStats(target.userNickname, res);
  }

  @Post('get-user-match-history')
  @UseGuards(JwtAuthGuard)
  getUserMatchHistory(
    @Res() res: Response,
    @Body() target: { userNickname: string },
  ) {
    return this.userService.getUserMatchHistory(target.userNickname, res);
  }

  @Get('get-leaderboard')
  @UseGuards(JwtAuthGuard)
  getLeaderBoard(@Res() res: Response) {
    return this.userService.getLeaderboard(res);
  }

  /** Achievement management */

  @Post('get-achievement')
  @UseGuards(JwtAuthGuard)
  getAchievement(@Body() data: { userNickname: string }, @Res() res: Response) {
    return this.userService.getAchievement(data.userNickname, res);
  }

  @Post('set-achievement')
  @UseGuards(JwtAuthGuard)
  setAchievement(
    @GetCurrentUserId() userId: string,
    @Body() data: { achievementId: string },
  ) {
    return this.userService.setAchievement(userId, data.achievementId);
  }
}
