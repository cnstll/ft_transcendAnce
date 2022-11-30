import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth-guard';
import { GetCurrentUserId } from 'src/common/decorators/getCurrentUserId.decorator';
import { BlockService } from './block.service';

@Controller('block')
export class BlockController {
  constructor(private blockService: BlockService) {}

  @Post('add-blocked-user')
  @UseGuards(JwtAuthGuard)
  addBlockedUser(
    @GetCurrentUserId() userId: string,
    @Body() data: { targetId: string },
  ) {
    return this.blockService.addBlockedUser(userId, data.targetId);
  }

  @Post('remove-blocked-user')
  @UseGuards(JwtAuthGuard)
  removeBlockedUser(
    @GetCurrentUserId() userId: string,
    @Body() data: { targetId: string },
  ) {
    return this.blockService.removeBlockedUser(userId, data.targetId);
  }

  @Get('current-user-blocked-relations')
  @UseGuards(JwtAuthGuard)
  async usersWithBlockRelation(
    @GetCurrentUserId() userId: string,
    @Res() res: Response,
  ) {
    const list = await this.blockService.usersWithBlockRelation(userId);
    if (list) return res.status(200).send(list);
    else return res.status(500);
  }

  @Get('users-blocked-by-current-user')
  @UseGuards(JwtAuthGuard)
  usersBlockedByCurrentUser(@GetCurrentUserId() userId: string) {
    return this.blockService.usersBlockedByCurrentUser(userId);
  }
}
