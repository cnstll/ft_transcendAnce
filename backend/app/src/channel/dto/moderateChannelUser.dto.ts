import { ChannelActionType } from '@prisma/client';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class ModerateChannelDto {
  @IsString()
  @IsNotEmpty()
  channelActionTargetId: string;

  @IsString()
  @IsNotEmpty()
  channelActionOnChannelId: string;

  @IsDate()
  @IsNotEmpty()
  channelActionDuration: Date;

  @IsString()
  @IsNotEmpty()
  type: ChannelActionType;
}
