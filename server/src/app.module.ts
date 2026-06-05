import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './common/infrastructure/database/database.module';
import { AuthModule } from './auth/auth.module';
import { PlaylistModule } from './playlists/playlists.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    PlaylistModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
