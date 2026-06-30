export type PlayerStatus = "idle" | "answering" | "correct" | "wrong";

export type RoomStatus = "waiting" | "active" | "finished";

export interface Player {
  id: string;
  name: string;
  avatarUrl?: string;
  isHost: boolean;
  status: PlayerStatus;
  score: number;
}

// Состояние воспроизведения — единственный источник правды для него сервер.
// Клиент НИКОГДА не меняет playback напрямую (нет локального play/pause на iframe);
// он только эмитит "pause_request" / "resume_request" в сокет и ждёт,
// когда сервер пришлёт обновлённый PlaybackState всем игрокам.
// Это гарантирует, что видео у всех в одной фазе без ручного согласования каждого клика.
export type PlaybackStatus = "playing" | "paused";

export interface PlaybackState {
  status: PlaybackStatus;
  // ID видео текущего раунда (youtube video id, 11 символов)
  youtubeVideoId: string;
  // позиция в секундах на момент последнего обновления с сервера —
  // нужна, чтобы клиент, подключившийся позже, мог восстановить точку воспроизведения
  positionSeconds: number;
}

export interface RoundState {
  roundNumber: number;
  // id игрока, который сейчас отвечает (buzz mode). null — никто не жмёт кнопку.
  answeringPlayerId: string | null;
  playback: PlaybackState;
}

export interface RoomState {
  roomId: string;
  status: RoomStatus;
  players: Player[];
  currentRound: RoundState | null;
}

// currentUserId — НЕ часть RoomState. RoomState приходит с сервера целиком
// и одинаков для всех клиентов; а "кто я" — это локальная session-информация
// (из auth), которая будет жить в отдельном auth/session store, а не в room store.
// Здесь это просто заглушка для мока на этом шаге.

export interface PlayerLeftPayload {
  playerId: string;
}

export interface AnswerResultPayload {
  playerId: string;
  status: PlayerStatus;
  // TODO
}

export interface ScoreUpdatedPayload {
  playerId: string;
  score: number;
  // TODO
}
