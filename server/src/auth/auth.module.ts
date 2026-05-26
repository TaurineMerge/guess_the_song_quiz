import { Module } from '@nestjs/common';
import { PasswordHasher } from './domain/ports/password-hasher.port';
import { BcryptPasswordHasher } from './infrastructure/crypto/password-hasher-bcrypt.adapter';
import { DatabaseModule } from 'src/common/infrastructure/database/database.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './guards/authentication.guard';
import { AccessTokenGuard } from './guards/access-token.guard';
import { AuthService } from './domain/auth.service';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './presenter/http/auth.controller';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  providers: [
    {
      provide: PasswordHasher,
      useClass: BcryptPasswordHasher,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard,
    AuthService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
