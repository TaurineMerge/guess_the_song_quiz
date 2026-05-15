import { IsString, IsEmail } from 'class-validator';

export class UserBaseDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}
