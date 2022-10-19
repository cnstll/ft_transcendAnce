import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth-guard';
import { GetCurrentUserId } from 'src/common/decorators/getCurrentUserId.decorator';
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

  @Get('get-channels-by-user-id')
  getChannelsByUserId(@GetCurrentUserId() userId: string) {
    return this.channelService.getChannelsByUserId(userId);
  }

  @Get('get-channel/:id')
  getChannelById(@Param('id') channelId: string) {
    return this.channelService.getChannelById(channelId);
  }

  //* Is this getter useful? */
  @Get('get-user-channel/:id')
  getChannelByUserId(@GetCurrentUserId() userId: string,
  @Param('id') channelId: string) {
    return this.channelService.getChannelByUserId(userId, channelId);
  }

  @Get('get-users-of-a-channel')
  getUsersOfAChannel(channelId: string) {
    return this.channelService.getUsersOfAChannel(channelId);
  }

  @Get('get-role-user-channel/:id')
  getRoleOfUserChannel(@GetCurrentUserId() userId: string,
  @Param('id') channelId: string) {
    return this.channelService.getRoleOfUserChannel(userId, channelId);
  }

  // // Create channel
  // @Post('create-channel')
  // createChannel(@Body() dto: any) {}

  // // Update channel
  // @Patch(':id')
  // editChannelById() {}

  // // Delete channel
  // @HttpCode(HttpStatus.NO_CONTENT)
  // @Delete(':id')
  // deleteChannelById() {}
}

// replace status codes by:
// 200 HttpStatus.OK
// 201 HttpStatus.CREATED
// 204 HttpStatus.NO_CONTENT
// 500 HttpStatus.INTERNAL_SERVER_ERROR
