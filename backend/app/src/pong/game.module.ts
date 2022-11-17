import { Module } from '@nestjs/common';
import { loadProtobuf } from 'src/test/protobuf';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

const ProtoBufProvider = {
  provide: 'PROTOBUFROOT',
  useFactory: async () => {
    const protobufRoot = await loadProtobuf('./proto/file.proto');
    return protobufRoot;
  },
};

@Module({
  providers: [GameGateway, GameService, ProtoBufProvider],
  imports: [],
})
export class GameModule {}
