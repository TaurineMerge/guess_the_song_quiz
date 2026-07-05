import { Module } from '@nestjs/common';
import { RoomsGateway } from './presenter/ws/rooms.gateway';
import { JwtModule } from '@nestjs/jwt';
import { RoomStorage } from './domain/ports/room-storage.port';
import { InMemoryStorage } from './infrastructure/storage/in-memory.storage';
import { RoomsService } from './domain/rooms.service';
import { RoomMapper } from './domain/room-mapper';
import { DatabaseModule } from 'src/common/infrastructure/database/database.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/auth/config/jwt.config';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  providers: [
    RoomsGateway,
    {
      provide: RoomStorage,
      useClass: InMemoryStorage,
    },
    RoomsService,
    RoomMapper,
  ],
  exports: [RoomsGateway],
})
export class RoomsModule {}
