import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt.auth-guard';
import { GetCurrentUserId } from '../common/decorators/getCurrentUserId.decorator';
import { ChannelService } from './channel.service';
import { CreateChannelDto, EditChannelDto } from './dto';
import { Response } from 'express';

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

  @Get('get-channel-by-user-id')
  getChannelsByUserId(@GetCurrentUserId() userId: string) {
    return this.channelService.getChannelsByUserId(userId);
  }

  @Get(':id')
  getChannelById(@Param('id') channelId: string) {
    return this.channelService.getChannelById(channelId);
  }

  /* Is this getter useful? */
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

  // Create channel
  @Post('create')
  createChannel(
    @GetCurrentUserId() userId: string,
    @Body() dto: CreateChannelDto,
    @Res() res: Response,
  ) {
    return this.channelService.createChannel(userId, dto, res);
  }

  // Update channel
  @Patch(':id')
  editChannelById(
    @GetCurrentUserId() userId: string,
    @Param('id') channelId: string,
    @Body() dto: EditChannelDto,
    @Res() res: Response,
  ) {
    return this.channelService.editChannelById(userId, channelId, dto, res);
  }

  // Delete channel
  @Delete(':id')
  deleteChannelById(@Param('id') channelId: string, @Res() res: Response) {
    return this.channelService.deleteChannelById(channelId, res);
  }
}
