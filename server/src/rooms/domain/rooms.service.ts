import { Inject, Injectable } from '@nestjs/common';
import { RoomStorage } from './ports/room-storage.port';
import {
  Player,
  PlayerStatus,
  Room,
  Round,
} from 'shared/rooms/types/room.types';
import { DRIZZLE } from 'src/common/infrastructure/database/orm/drizzle.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { users } from 'src/users/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class RoomsService {
  constructor(
    private roomStorage: RoomStorage,
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase,
  ) {}

  async getRoomState(roomId: string) {
    return this.roomStorage.getRoomById(roomId);
  }

  async addPlayer(roomId: string, playerId: string) {
    let player: Player | undefined = (
      await this.roomStorage.getRoomById(roomId)
    ).players.get(playerId);

    if (!player) {
      const [user] = await this.db
        .select()
        .from(users)
        .where(eq(users.userId, playerId))
        .limit(1);

      if (!user) throw new Error('User not found');

      const playerName = user.username;

      player = {
        id: playerId,
        name: playerName,
        isHost: false,
        score: 0,
        status: 'idle',
      };

      return this.roomStorage.addPlayer(roomId, player);
    }

    return player;
  }

  async removePlayer(roomId: string, playerId: string) {
    return this.roomStorage.removePlayer(roomId, playerId);
  }

  async checkAnswer(
    roomId: string,
    playerId: string,
    answer: string,
  ): Promise<Extract<PlayerStatus, 'correct' | 'wrong'>> {
    if (await this.isLockedByAnotherPlayer(roomId, playerId))
      throw new Error('Answer is locked by other player');
    const room = await this.getRoomState(roomId);

    const round = this.getCurrentRound(room);
    const player = this.getPlayer(room, playerId);

    const result = this.handlePlayerAnswer(round, player, answer);

    await this.unlock(roomId);

    return result;
  }

  async setLock(roomId: string, playerId: string): Promise<Player> {
    if (await this.isLockedByAnotherPlayer(roomId, playerId))
      throw new Error('Answer is locked by other player');
    const room = await this.getRoomState(roomId);

    const round = this.getCurrentRound(room);
    const player = this.getPlayer(room, playerId);

    round.answeringPlayerId = playerId;
    round.playback.status = 'paused';

    return player;
  }

  async unlock(roomId: string): Promise<void> {
    const room = await this.getRoomState(roomId);
    const round = this.getCurrentRound(room);
    round.answeringPlayerId = null;
    round.playback.status = 'playing';
  }

  private async isLockedByAnotherPlayer(roomId: string, playerId: string) {
    const room = await this.getRoomState(roomId);
    const round = this.getCurrentRound(room);
    return round.answeringPlayerId && round.answeringPlayerId !== playerId;
  }

  private getPlayer(room: Room, playerId: string): Player {
    const player = room.players.get(playerId);
    if (!player) throw new Error('Player not found');

    return player;
  }

  private getCurrentRound(room: Room): Round {
    const round = room.currentRound;
    if (!round) throw new Error('Current round not found');

    return round;
  }

  private handlePlayerAnswer(round: Round, player: Player, answer: string) {
    const rightAnswer = round.answer;
    const result = rightAnswer === answer ? 'correct' : 'wrong';

    switch (result) {
      case 'correct':
        this.applyCorrectAnswer(player);
        this.nextRound(round);
        break;
      case 'wrong':
        this.applyWrongAnswer(player);
        break;
    }

    return result;
  }

  private applyCorrectAnswer(player: Player) {
    const CORRECT_ANSWER_POINTS = 50;
    player.score += CORRECT_ANSWER_POINTS;
    player.status = 'correct';
  }

  private applyWrongAnswer(player: Player) {
    player.status = 'wrong';
  }

  private nextRound(round: Round) {
    round.roundNumber++;
    // youtube: next video
  }
}
