import { ChannelType } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class ChannelDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  type?: ChannelType;

  @IsString()
  @IsOptional()
  passwordHash?: string;
}
