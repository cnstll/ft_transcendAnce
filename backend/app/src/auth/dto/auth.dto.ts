import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

class Img {
  @IsString()
  @IsNotEmpty()
  link: string;
}

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsNumber()
  @IsNotEmpty()
  id: number;

  image: Img;
}
