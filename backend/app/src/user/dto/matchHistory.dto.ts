import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MatchHistoryDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  imageCurrentUser: string;

  @IsNotEmpty()
  @IsString()
  imageOpponent: string;

  @IsNotEmpty()
  @IsString()
  score: string;

  @IsNotEmpty()
  @IsString()
  matchWon: boolean;
}
