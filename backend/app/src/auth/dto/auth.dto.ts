import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  login: string;


  @IsNumber()
  @IsNotEmpty()
  id: number;


  @IsString()
  @IsNotEmpty()
  image_url: string;
}
