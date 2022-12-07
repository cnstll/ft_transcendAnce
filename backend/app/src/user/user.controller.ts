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

const fileTypes = [
  'image/apng',
  'image/bmp',
  'image/gif',
  'image/jpeg',
  'image/pjpeg',
  'image/png',
  'image/svg+xml',
  'image/tiff',
  'image/webp',
  'image/x-icon',
];

export const storage = {
  storage: diskStorage({
    destination: './avatar',
    filename: (req, file, cb) => {
      if (!fileTypes.includes(file.mimetype)) {
        return;
      }
      const initialFilename: string = path
        .parse(file.originalname)
        .name.replace(/\s/g, '');
      const filename = Buffer.from(initialFilename, 'latin1').toString('utf8');
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

  @Get('get-front-user-info')
  @UseGuards(JwtAuthGuard)
  getFrontUserInfo(@GetCurrentUserId() userId: string) {
    return this.userService.getFrontUserInfo(userId);
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
  async updateAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
    @GetCurrentUserId() userId: string,
  ) {
    if (file.path && process.env.PUBLIC_URL) {
      const filename = `${process.env.PUBLIC_URL}/user/${file.path}`;
      await this.userService.updateAvatarImg(userId, filename, res);
      return res.status(200).send();
    }
  }

  @Get('avatar/:fileId')
  serveAvatar(@Param('fileId') fileId: string, @Res() res: Response) {
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
  logout(@Res() res: Response, @GetCurrentUserId() userId: string) {
    return this.userService.logout(res, userId);
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

  /** Channel invitations */
  @Get('get-channel-invites')
  @UseGuards(JwtAuthGuard)
  getChannelInvites(@GetCurrentUserId() userId: string) {
    return this.userService.getChannelInvites(userId);
  }
}
