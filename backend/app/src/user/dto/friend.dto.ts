import { IsNotEmpty, IsString } from 'class-validator';

export class FriendDto {
  @IsNotEmpty()
  @IsString()
  target: string;

  friends: boolean;
}
