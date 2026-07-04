import { Module } from '@nestjs/common';
import { RoomsGateway } from './presenter/ws/rooms.gateway';
import { JwtService } from '@nestjs/jwt';
import { RoomStorage } from './domain/ports/room-storage.port';
import { InMemoryStorage } from './infrastructure/storage/in-memory.storage';
import { RoomsService } from './domain/rooms.service';
import { RoomMapper } from './domain/room-mapper';
import { DatabaseModule } from 'src/common/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [
    RoomsGateway,
    JwtService,
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
