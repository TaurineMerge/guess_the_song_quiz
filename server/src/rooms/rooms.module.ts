import { Module } from '@nestjs/common';
import { RoomsGateway } from './presenter/ws/rooms.gateway';

@Module({
  providers: [RoomsGateway],
  exports: [RoomsGateway],
})
export class RoomsModule {}
