import { IsNotEmpty, IsString } from 'class-validator';

export class PayloadDto {
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @IsNotEmpty()
  @IsString()
  id: string;
}
