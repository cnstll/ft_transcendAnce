import { IsBoolean, IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class FriendDto {
  @IsNotEmpty()
  @IsString()
  target: string;

  @IsBoolean()
  @IsDefined()
  friends: boolean;
}
