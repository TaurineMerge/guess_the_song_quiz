import { Injectable } from '@nestjs/common';
import { Player, Room } from 'shared/rooms/types/room.types';

@Injectable()
export abstract class RoomStorage {
  abstract getRoomById(roomId: string): Promise<Room>;
  abstract addPlayer(roomId: string, player: Player): Promise<Player>;
  abstract removePlayer(roomId: string, playerId: string): Promise<Player>;
  abstract isParticipant(roomId: string, playerId: string): Promise<boolean>;
}
