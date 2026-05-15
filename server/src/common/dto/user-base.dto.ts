import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UserBaseDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @MinLength(6)
  @IsOptional()
  password: string;
}
