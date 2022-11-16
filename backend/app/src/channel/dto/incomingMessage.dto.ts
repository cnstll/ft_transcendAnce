import { IsNotEmpty, IsString } from 'class-validator';

export class IncomingMessageDto {
  @IsString()
  @IsNotEmpty()
  channelId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
