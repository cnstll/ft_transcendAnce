import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FriendDto {
  @IsNotEmpty()
  @IsString()
  target: string;

  @IsBoolean()
  @IsOptional()
  friends?: boolean;
}
