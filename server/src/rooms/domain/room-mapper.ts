import { Injectable } from '@nestjs/common';
import { Room, RoomDto } from 'shared/rooms/types/room.types';

@Injectable()
export class RoomMapper {
  toDto(room: Room): RoomDto {
    return {
      roomId: room.roomId,
      currentRound: room.currentRound,
      players: [...room.players.values()],
      status: room.status,
    };
  }
}
