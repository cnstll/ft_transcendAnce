import { ChannelType } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DeleteChannelDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  type?: ChannelType;

  @IsString()
  @IsOptional()
  passwordHash?: string;
}
