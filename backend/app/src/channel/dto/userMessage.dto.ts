import { IsNotEmpty, IsString } from 'class-validator';

export class UserMessageDto {
  @IsString()
  @IsNotEmpty()
  senderId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
