import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class StatDto {
  @IsNotEmpty()
  @IsString()
  numberOfWin: number;

  @IsBoolean()
  @IsOptional()
  numberOfLoss: number;
}
