import { IsNotEmpty, IsNumber } from 'class-validator';

export class StatDto {
  @IsNotEmpty()
  @IsNumber()
  numberOfWin: number;

  @IsNotEmpty()
  @IsNumber()
  numberOfLoss: number;
}
