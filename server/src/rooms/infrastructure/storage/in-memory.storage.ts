import { Player, Room } from 'shared/rooms/types/room.types';
import { RoomStorage } from 'src/rooms/domain/ports/room-storage.port';

export class InMemoryStorage extends RoomStorage {
  #rooms: Map<string, Room>;

  constructor() {
    super();
    this.#rooms = new Map<string, Room>();
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getRoomById(roomId: string): Promise<Room> {
    const room = this.#rooms.get(roomId);
    if (!room) throw new Error('Room does not exist');
    return room;
  }

  async addPlayer(roomId: string, player: Player): Promise<Player> {
    const room = await this.getRoomById(roomId);
    room.players.set(player.id, player);
    return player;
  }

  async removePlayer(roomId: string, playerId: string): Promise<Player> {
    const room = await this.getRoomById(roomId);

    const player = room.players.get(playerId);
    if (!player) throw new Error('Player not found');

    const wasDeleted = room.players.delete(playerId);
    if (!wasDeleted) throw new Error('Player cannot be removed');

    return player;
  }

  async getAnswer(roomId: string): Promise<string> {
    const room = await this.getRoomById(roomId);

    const round = room.currentRound;
    if (!round) throw new Error('Current round not found');

    const answer = round.answer;
    return answer;
  }

  async isParticipant(roomId: string, playerId: string): Promise<boolean> {
    const room = await this.getRoomById(roomId);
    return room.players.has(playerId);
  }
}
