import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guard/jwt.auth-guard';
import { GetCurrentUserId } from '../common/decorators/getCurrentUserId.decorator';
import { ChannelService } from './channel.service';

@UseGuards(JwtAuthGuard)
@Controller('channels')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Get()
  getChannels() {
    return this.channelService.getChannels();
  }

  @Get('get-group-channels')
  getGroupChannels() {
    return this.channelService.getGroupChannels();
  }

  @Get('get-all-channel-by-user-id')
  getAllChannelsByUserId(@GetCurrentUserId() userId: string) {
    return this.channelService.getAllChannelsByUserId(userId);
  }

  @Post('get-direct-message-by-user-id')
  getDirectMessageByUserId(
    @GetCurrentUserId() userId: string,
    @Body() data: { participantId: string },
  ) {
    return this.channelService.getDirectMessageByUserId(
      userId,
      data.participantId,
    );
  }

  @Get(':id')
  getChannelById(@Param('id') channelId: string) {
    return this.channelService.getChannelById(channelId);
  }

  @Get('get-user-channel/:id')
  getChannelByUserId(
    @GetCurrentUserId() userId: string,
    @Param('id') channelId: string,
  ) {
    return this.channelService.getChannelByUserId(userId, channelId);
  }

  @Get('get-users-of-a-channel/:id')
  getUsersOfAChannel(@Param('id') channelId: string) {
    return this.channelService.getUsersOfAChannel(channelId);
  }

  @Get('get-role-user-channel/:id')
  getRoleOfUserChannel(
    @GetCurrentUserId() userId: string,
    @Param('id') channelId: string,
  ) {
    return this.channelService.getRoleOfUserChannel(userId, channelId);
  }

  @Get('get-invites/:id')
  getInvitesOfAChannel(@Param('id') channelId: string) {
    return this.channelService.getInvitesOfAChannel(channelId);
  }

  // @Get('get-invite/:id')
  // getIsInvitedInAChannel(
  //   @GetCurrentUserId() userId: string,
  //   @Param('id') channelId: string,
  // ) {
  //   return this.channelService.getIsInvitedInAChannel(userId, channelId);
  // }

  @Get('get-invitable-users/:id')
  getInvitableUsers(
    @GetCurrentUserId() userId: string,
    @Param('id') channelId: string,
  ) {
    return this.channelService.getInvitableUsers(userId, channelId);
  }

  @Get('get-messages-from-channel/:id')
  getMessagesFromChannel(@Param('id') channelId: string, @Res() res: Response) {
    return this.channelService.getMessagesFromChannel(channelId, res);
  }
  @Get('get-authors-from-channel/:id')
  getAuthorsFromAChannel(@Param('id') channelId: string) {
    return this.channelService.getChannelAuthors(channelId);
  }
}
