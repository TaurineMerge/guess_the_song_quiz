import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { roomClientEvents } from 'shared/rooms/events/room-client-events';
import { roomServerEvents } from 'shared/rooms/events/room-server-events';
import { AnswerResultPayload } from 'shared/rooms/types/room.types';
import { UseGuards } from '@nestjs/common';
import { RoomParticipantGuard } from 'src/rooms/guards/room-participant.guard';
import { WsJwtGuard } from 'src/rooms/guards/ws-jwt.guard';
import { RoomsService } from 'src/rooms/domain/rooms.service';
import { ActiveUser } from 'src/rooms/decorators/active-user.decorator';
import { RoomMapper } from 'src/rooms/domain/room-mapper';

@UseGuards(WsJwtGuard)
@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
  transports: ['polling', 'websocket'],
})
export class RoomsGateway {
  constructor(
    private roomsService: RoomsService,
    private roomMapper: RoomMapper,
  ) {}

  @UseGuards(RoomParticipantGuard)
  @SubscribeMessage(roomClientEvents.SUBMIT_ANSWER)
  async handleAnswer(
    @ActiveUser('sub') userId: string,
    @MessageBody() data: { roomId: string; answer: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, answer } = data;

    const isRightAnswer = await this.roomsService.checkAnswer(
      roomId,
      userId,
      answer,
    );

    const result: AnswerResultPayload = {
      playerId: userId,
      roomId,
      status: isRightAnswer,
    };

    client.to(data.roomId).emit(roomServerEvents.ANSWER_RESULT, result);
  }

  @UseGuards(RoomParticipantGuard)
  @SubscribeMessage(roomClientEvents.LEAVE_ROOM)
  async handleLeaving(
    @ActiveUser('sub') userId: string,
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const roomId = data.roomId;
    await client.leave(roomId);

    const player = await this.roomsService.removePlayer(roomId, userId);

    client.to(roomId).emit(roomServerEvents.PLAYER_LEFT, {
      id: player.id,
      name: player.name,
    });
  }

  @UseGuards(RoomParticipantGuard)
  @SubscribeMessage(roomClientEvents.ROOM_STATE)
  async handleRoomState(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void | null> {
    const roomId = data.roomId;
    const room = await this.roomsService.getRoomState(roomId);
    const roomDto = this.roomMapper.toDto(room);
    client.emit(roomServerEvents.ROOM_STATE, roomDto);
  }

  @UseGuards(RoomParticipantGuard)
  @SubscribeMessage(roomClientEvents.ANSWER_LOCK)
  async handleAnswerLock(
    @ActiveUser('sub') userId: string,
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void | null> {
    const roomId = data.roomId;

    const player = await this.roomsService.setLock(roomId, userId);

    client.to(roomId).emit(roomServerEvents.ANSWER_LOCK, {
      id: player.id,
      name: player.name,
    });
  }

  @UseGuards(RoomParticipantGuard)
  @SubscribeMessage(roomClientEvents.JOIN_ROOM)
  async handleRoomJoin(
    @ActiveUser('sub') userId: string,
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void | null> {
    const roomId = data.roomId;
    await client.join(roomId);

    const player = await this.roomsService.addPlayer(roomId, userId);

    client.to(roomId).emit(roomServerEvents.PLAYER_JOINED, player);
  }
}
