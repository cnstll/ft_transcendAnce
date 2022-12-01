import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { ChannelController } from './channel.controller';
import { ChannelGateway } from './channel.gateway';
import { ChannelService } from './channel.service';

@Module({
  controllers: [ChannelController],
  providers: [ChannelService, ChannelGateway],
  imports: [UserModule],
})
export class ChannelModule {}
