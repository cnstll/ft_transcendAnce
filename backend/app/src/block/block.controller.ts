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

  @Get('users-blocked-by-current-user')
  @UseGuards(JwtAuthGuard)
  async usersBlockedByCurrentUser(
    @GetCurrentUserId() userId: string,
    @Res() res: Response,
  ) {
    const listBlockedUsers = await this.blockService.usersBlockedByCurrentUser(
      userId,
    );
    if (listBlockedUsers) return res.status(200).send(listBlockedUsers);
    else return res.status(500);
  }

  @Get('users-who-blocked-current-user')
  @UseGuards(JwtAuthGuard)
  async usersWhoBlockedCurrentUser(
    @GetCurrentUserId() userId: string,
    @Res() res: Response,
  ) {
    const listUsersWhoBlocked =
      await this.blockService.usersWhoBlockedCurrentUser(userId);
    if (listUsersWhoBlocked) return res.status(200).send(listUsersWhoBlocked);
    else return res.status(500);
  }
}
