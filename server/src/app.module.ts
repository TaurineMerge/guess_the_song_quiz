import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './common/infrastructure/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './common/infrastructure/config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
