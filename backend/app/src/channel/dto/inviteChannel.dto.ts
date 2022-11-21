import { ChannelType } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class InviteChannelDto {
  @IsString()
  @IsNotEmpty()
  channelId: string;

  @IsString()
  @IsNotEmpty()
  invitedId: string;

  @IsString()
  @IsNotEmpty()
  type: ChannelType;
}
