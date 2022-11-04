import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class StatDto {
  @IsNotEmpty()
  @IsNumber()
  numberOfWin: number;

  @IsNotEmpty()
  @IsNumber()
  numberOfLoss: number;

  @IsNotEmpty()
  @IsString()
  ranking: string;
}
