import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @MinLength(6)
  @IsOptional()
  password: string;
}
