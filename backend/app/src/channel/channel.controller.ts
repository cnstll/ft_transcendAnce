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
import { ChannelDto } from './dto';
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

  @Get('get-by-user-id')
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

  /* Is it possible without routing on id? */
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
    @Body() dto: ChannelDto,
    @Res() res: Response,
  ) {
    return this.channelService.createChannel(userId, dto, res);
  }

  // Update channel
  @Patch(':id')
  editChannelById(
    @GetCurrentUserId() userId: string,
    @Param('id') channelId: string,
    @Body() dto: ChannelDto,
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

// replace status codes by:
// 200 HttpStatus.OK
// 201 HttpStatus.CREATED
// 204 HttpStatus.NO_CONTENT
// 500 HttpStatus.INTERNAL_SERVER_ERROR
