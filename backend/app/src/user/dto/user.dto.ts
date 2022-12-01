import { IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @IsNotEmpty()
  @IsString()
  immutableId: string;

  @IsNotEmpty()
  @IsString()
  avatarImg: string;
}
