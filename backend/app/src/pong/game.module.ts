import { Module } from '@nestjs/common';
import { loadProtobuf } from 'src/proto/protobuf';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

const ProtoBufProvider = {
  provide: 'PROTOBUFROOT',
  useFactory: async () => {
    const protobufRoot = await loadProtobuf('./src/proto/file.proto');
    return protobufRoot;
  },
};

@Module({
  providers: [GameGateway, GameService, ProtoBufProvider],
  imports: [],
})
export class GameModule {}
