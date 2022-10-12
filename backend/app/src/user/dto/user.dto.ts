import { IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  nickName: string;

  @IsNotEmpty()
  @IsString()
  passwordHash: string;
}
