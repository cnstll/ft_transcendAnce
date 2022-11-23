import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth-guard';
import { Body, UseGuards } from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorators/getCurrentUserId.decorator';
import { FrontendUser, GameMode } from './entities/game.entities';

@WebSocketGateway(3333, {
  cors: {
    origin: [
      process.env.FRONTEND_URL,
      process.env.BACKEND_URL,
      process.env.DOMAIN,
      process.env.PUBLIC_URL,
    ],
    credentials: true,
  },
  parser: require('socket.io-msgpack-parser'),
})
export class GameGateway {
  @WebSocketServer()
  server: Server;
  socketToId = new Map<string, string>();

  constructor(private readonly gameService: GameService) {}

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('PP')
  async create(
    @MessageBody() encoded: Uint8Array,
    @GetCurrentUserId() id: string,
  ) {
    this.gameService.create(encoded, id);
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('disconnect')
  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.gameService.pause(this.socketToId.get(client.id), this.server);
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('leaveGame')
  handleAbandon(@ConnectedSocket() client: Socket) {
    this.gameService.pause(this.socketToId.get(client.id), this.server);
  }
  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('reJoin')
  rejoin(@GetCurrentUserId() userId: string) {
    return this.gameService.rejoin(userId);
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('refuseInvite')
  refuseGameInvite(
    @Body() challenger: FrontendUser,
    @ConnectedSocket() client: Socket,
  ) {
    this.gameService.cancelInvite(client, challenger.id);
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('createInvitationGame')
  createInvitationGame(
    @MessageBody('mode') mode: GameMode,
    @MessageBody('opponent') playerTwoId: GameMode,
    @ConnectedSocket() client: Socket,
    @GetCurrentUserId() playerOneId: string,
  ) {
    this.socketToId.set(client.id, playerOneId);
    return this.gameService.createInvitationGame(
      client,
      this.server,
      playerOneId,
      playerTwoId,
      mode,
    );
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('joinGame')
  joinRoom(
    @MessageBody('mode') mode: GameMode,
    @ConnectedSocket() client: Socket,
    @GetCurrentUserId() id: string,
  ) {
    this.socketToId.set(client.id, id);
    return this.gameService.join(client, id, this.server, mode);
  }
}
