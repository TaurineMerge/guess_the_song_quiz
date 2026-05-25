import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsEmail()
  @IsOptional()
  email: string;
}
