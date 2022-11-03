import { IsOptional, IsString } from 'class-validator';

export class JoinChannelDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  passwordHash?: string;
}
