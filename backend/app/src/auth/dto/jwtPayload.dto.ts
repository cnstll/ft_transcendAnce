import { IsNotEmpty, IsString } from 'class-validator';

export class PayloadDto {
  @IsNotEmpty()
  @IsString()
  nickName: string;

  @IsNotEmpty()
  @IsString()
  id: string;
}
