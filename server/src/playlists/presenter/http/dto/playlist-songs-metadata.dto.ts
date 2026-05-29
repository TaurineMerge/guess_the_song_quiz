export class PlaylistSongsDto {
  playlistTitle: string;
  playlistSongs: {
    songTitle: string;
    songLinkId: string;
    artist: string;
    durationSeconds: number;
    normalizedTitleArtist: string;
    position: number;
  };
}
