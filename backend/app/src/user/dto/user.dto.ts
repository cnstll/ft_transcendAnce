import { IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @IsNotEmpty()
  @IsString()
  passwordHash: string;

  @IsNotEmpty()
  @IsString()
  avatarImg: string;
}
