import type { PlaybackState } from "shared/rooms/types/room.types";
import styles from "./youtube-player.module.css";

interface YoutubePlayerProps {
  playback: PlaybackState;
}

// Этот компонент НЕ управляет воспроизведением напрямую.
// status/positionSeconds приходят с сервера (через RoomState) и являются
// единственным источником правды — так у всех игроков видео в одной фазе.
// Локальный play/pause здесь не нужен и не должен появиться: любое желание
// поставить на паузу выражается через emit('pause_request') в RoomLobby,
// а не через прямой вызов player API из этого компонента.
//
// Сейчас — просто верстка с мок youtube_video_id, без реального YouTube
// iframe API (postMessage, player events). Это отдельный шаг вместе с сокетом.
export function YoutubePlayer({ playback }: YoutubePlayerProps) {
  const embedUrl = `https://www.youtube.com/embed/${playback.youtubeVideoId}?autoplay=${
    playback.status === "playing" ? 1 : 0
  }&start=${Math.floor(playback.positionSeconds)}&controls=0`;

  return (
    <iframe
      className={styles.hiddenPlayer}
      src={embedUrl}
      title="youtube-audio-source"
      aria-hidden="true"
      tabIndex={-1}
      allow="autoplay"
    />
  );
}
