import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class MatchHistoryDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  imageOpponent: string;

  @IsNotEmpty()
  @IsString()
  score: string;

  @IsNotEmpty()
  @IsBoolean()
  matchWon: boolean;
}
