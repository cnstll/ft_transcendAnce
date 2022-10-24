import { IsNotEmpty, IsString } from 'class-validator';

export class TwoFactorAuthenticationDto {
  @IsNotEmpty()
  @IsString()
  twoFactorAuthenticationCode: string;
}
