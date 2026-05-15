import { PickType } from '@nestjs/swagger';
import { UsersBaseDto } from 'src/common/dto/users-base.dto';

export class SignUpDto extends PickType(UsersBaseDto, [
  'username',
  'email',
  'password',
]) {}
