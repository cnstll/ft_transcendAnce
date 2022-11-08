import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { Socket } from 'socket.io';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class RankingService {
  constructor(
    private prismaService: PrismaService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  list(client: Socket, server: Server) {
    // this.userService.getLeaderboard(res);
  }
}
