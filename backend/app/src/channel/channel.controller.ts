import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ChannelActionType } from '@prisma/client';
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

  @Get('get-all-channels-by-user-id')
  getAllChannelsByUserId(@GetCurrentUserId() userId: string) {
    return this.channelService.getAllChannelsByUserId(userId);
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

  @Get('get-roles-users-channel/:id')
  getRolesOfUsersChannel(@Param('id') channelId: string) {
    return this.channelService.getRolesOfUsersChannel(channelId);
  }

  @Get('get-invites/:id')
  getInvitesOfAChannel(@Param('id') channelId: string) {
    return this.channelService.getInvitesOfAChannel(channelId);
  }

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

  @Post('get-direct-message-between-users')
  async getDirectMessageBetweenUsers(
    @GetCurrentUserId() userId: string,
    @Body() data: { targetId: string },
    @Res() res: Response,
  ) {
    const channel = await this.channelService.getDirectMessageByUserId(
      userId,
      data.targetId,
    );
    if (channel) return res.status(200).send(channel.id);
    else return res.status(200).send(null);
  }

  @Get('get-users-under-moderation-action/:channelId/:actionType')
  getUsersUnderModerationAction(
    @Param('channelId') channelId: string,
    @Param('actionType') actionType: ChannelActionType,
  ) {
    return this.channelService.getUsersUnderModerationAction(
      channelId,
      actionType,
    );
  }
}
