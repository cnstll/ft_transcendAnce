import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth-guard';
import { GetCurrentUserId } from 'src/common/decorators/getCurrentUserId.decorator';
import { ChannelService } from './channel.service';

@UseGuards(JwtAuthGuard)
@Controller('channels')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Get('get-all-channels')
  getChannels() {
    return this.channelService.getChannels();
  }

  @Get('get-user-channels')
  getChannelsByUserId(@GetCurrentUserId() userId: string) {
    return this.channelService.getChannelsByUserId(userId);
  }

  @Get('get-channel/:id')
  getChannelById(@Param('id') channelId: string) {
    return this.channelService.getChannelById(channelId);
  }

  @Get('get-user-channel/:id')
  getChannelByUserId(@GetCurrentUserId() userId: string,
  @Param('id') channelId: string) {
    return this.channelService.getChannelByUserId(userId, channelId);
  }

  // Create channel
  @Post('create-channel')
  createChannel(@Body() dto: any) {}

  // Update channel
  @Patch(':id')
  editChannelById() {}

  // Delete channel
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteChannelById() {}
}

// replace status codes by:
// 200 HttpStatus.OK
// 201 HttpStatus.CREATED
// 204 HttpStatus.NO_CONTENT
// 500 HttpStatus.INTERNAL_SERVER_ERROR
