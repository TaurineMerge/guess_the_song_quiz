import { Module } from '@nestjs/common';
import { PasswordHasher } from './ports/password-hasher.port';
import { BcryptPasswordHasher } from './infrastructure/crypto/password-hasher-bcrypt.adapter';
import { DatabaseModule } from 'src/common/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: PasswordHasher,
      useClass: BcryptPasswordHasher,
    },
  ],
})
export class AuthModule {}
