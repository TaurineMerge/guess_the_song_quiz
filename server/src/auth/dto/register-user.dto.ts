import { MinLength } from 'class-validator';
import { UserBaseDto } from 'src/common/dto/user-base.dto';

export class RegisterUserDto extends UserBaseDto {
  @MinLength(6)
  password: string;
}
