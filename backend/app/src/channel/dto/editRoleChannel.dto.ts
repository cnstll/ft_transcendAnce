import { IsNotEmpty, IsString } from 'class-validator';

export class EditRoleChannelDto {
  @IsString()
  @IsNotEmpty()
  promotedUserId: string;
}
