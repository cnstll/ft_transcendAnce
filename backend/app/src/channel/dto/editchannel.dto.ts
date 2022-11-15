import { ChannelType } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EditChannelDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsOptional()
  type?: ChannelType;

  @IsString()
  @IsOptional()
  passwordHash?: string;

  @IsString()
  @IsOptional()
  currentPasswordHash?: string;
}
