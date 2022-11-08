import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { RankingService } from './raking.service';

@Module({
  providers: [RankingService],
  imports: [UserModule],
})
export class RankingModule {}
