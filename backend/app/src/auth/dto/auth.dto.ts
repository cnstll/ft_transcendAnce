import { IsNotEmpty, IsString } from "class-validator";

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  name: String;
}
