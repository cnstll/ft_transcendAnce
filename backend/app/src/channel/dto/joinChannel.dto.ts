import { ChannelType } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class JoinChannelDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  type: ChannelType;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  passwordHash?: string;
}
