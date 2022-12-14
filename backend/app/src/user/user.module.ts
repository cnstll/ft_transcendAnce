import { Module } from '@nestjs/common';
import { SocketToUserIdStorage } from './socketToUserIdStorage.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import 'socket.io-msgpack-parser';

@Module({
  controllers: [UserController],
  providers: [UserService, SocketToUserIdStorage],
  exports: [UserService, SocketToUserIdStorage],
})
export class UserModule {
  void;
}
