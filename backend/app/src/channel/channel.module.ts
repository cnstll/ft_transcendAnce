import { Module } from '@nestjs/common';
import { BlockModule } from 'src/block/block.module';
import { UserModule } from 'src/user/user.module';
import { ChannelController } from './channel.controller';
import { ChannelGateway } from './channel.gateway';
import { ChannelService } from './channel.service';

@Module({
  controllers: [ChannelController],
  providers: [ChannelService, ChannelGateway],
  imports: [BlockModule, UserModule],
})
export class ChannelModule {
  void;
}
