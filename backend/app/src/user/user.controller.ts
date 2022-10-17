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
  updateAvatarImg(@Res() res: any, @Req() req: any, @Body() data: any) {
    this.userService.updateAvatarImg(req.user.userId, data.newAvatarImg);
    return res.status(200).send();
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
