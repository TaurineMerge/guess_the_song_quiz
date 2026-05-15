import { UsersBaseDto } from 'src/common/dto/users-base.dto';
import { PartialType, PickType } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(
  PickType(UsersBaseDto, ['username', 'email']),
) {}
