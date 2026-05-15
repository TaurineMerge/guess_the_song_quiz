import { UserBaseDto } from 'src/common/dto/user-base.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(UserBaseDto) {}
