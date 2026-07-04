import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { RoomStorage } from '../domain/ports/room-storage.port';
import { Socket } from 'socket.io';

@Injectable()
export class RoomParticipantGuard implements CanActivate {
  constructor(private readonly roomStorage: RoomStorage) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const data: { roomId: string } = context.switchToWs().getData();

    const userId = (client.data as { userId: string }).userId;
    const roomId = data.roomId;

    const isParticipant = await this.roomStorage.isParticipant(roomId, userId);

    if (!isParticipant) {
      throw new WsException('Forbidden');
    }

    return true;
  }
}
