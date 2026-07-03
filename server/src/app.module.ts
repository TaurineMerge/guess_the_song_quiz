import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './common/infrastructure/database/database.module';
import { AuthModule } from './auth/auth.module';
import { PlaylistModule } from './playlists/playlists.module';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    PlaylistModule,
    RoomsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
