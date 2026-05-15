import { Module } from '@nestjs/common';
import { PasswordHasher } from './ports/password-hasher.port';
import { BcryptPasswordHasher } from './infrastructure/crypto/password-hasher-bcrypt.adapter';

@Module({
  providers: [
    {
      provide: PasswordHasher,
      useClass: BcryptPasswordHasher,
    },
  ],
})
export class AuthModule {}
