import { ChannelType } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class JoinChannelDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  passwordHash?: string;
}
