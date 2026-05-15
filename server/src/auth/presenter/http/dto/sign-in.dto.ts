import { PickType } from '@nestjs/swagger';
import { UsersBaseDto } from 'src/common/dto/users-base.dto';

export class SignInDto extends PickType(UsersBaseDto, ['email', 'password']) {}
