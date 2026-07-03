import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'node_modules/socket.io/dist/socket';
import { roomClientEvents } from 'shared/rooms/events/room-client-events';
import { roomServerEvents } from 'shared/rooms/events/room-server-events';
import { AnswerResultPayload } from 'shared/rooms/types/room.types';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
  transports: ['polling', 'websocket'],
})
export class RoomsGateway implements OnGatewayConnection {
  constructor(private jwtService: JwtService) {}

  @SubscribeMessage(roomClientEvents.SUBMIT_ANSWER)
  handleAnswer(
    @MessageBody() data: { roomId: string; answer: string },
    @ConnectedSocket() client: Socket,
  ) {
    // TODO: answer validation
    const result: AnswerResultPayload = {
      playerId: client.data.user.sub,
      roomId: data.roomId,
      status: 'correct',
    };

    client.to(data.roomId).emit(roomServerEvents.ANSWER_RESULT, result);
  }

  @SubscribeMessage(roomClientEvents.LEAVE_ROOM)
  async handleLeaving(
    @MessageBody('roomId') roomId: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await client.leave(roomId);
    client.to(roomId).emit(roomServerEvents.PLAYER_LEFT, {
      id: client.data.user.sub,
      // остальные поля игрока из БД
    });
  }

  @SubscribeMessage(roomClientEvents.JOIN_ROOM)
  async handleJoin(
    @MessageBody('roomId') roomId: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await client.join(roomId);
    client.to(roomId).emit(roomServerEvents.PLAYER_JOINED, {
      id: client.data.user.sub,
      // остальные поля игрока из БД
    });
  }

  handleConnection(client: Socket): void {
    try {
      const token = client.handshake.auth.token as string;
      const user = this.jwtService.verify<Pick<JwtPayload, 'sub'>>(token);
      client.data.user = user;
    } catch {
      client.disconnect();
    }
  }
}
