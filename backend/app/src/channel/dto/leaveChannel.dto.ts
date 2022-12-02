import { ChannelType } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class LeaveChannelDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  type: ChannelType;
}
