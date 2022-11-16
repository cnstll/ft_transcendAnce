import { ChannelType } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class InviteChannelDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  invitedId: string;

  @IsString()
  @IsNotEmpty()
  type: ChannelType;
}
