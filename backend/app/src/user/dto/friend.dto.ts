import { IsNotEmpty, IsString } from 'class-validator';

export class FriendDto {
  @IsNotEmpty()
  @IsString()
  requester: string;

  @IsNotEmpty()
  @IsString()
  addressee: string;

  accept: boolean;
}
