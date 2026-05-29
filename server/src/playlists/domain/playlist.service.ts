import { Injectable } from '@nestjs/common';
import { PlaylistSongsDto } from '../presenter/http/dto/playlist-songs-metadata.dto';

@Injectable()
export class PlaylistService {
  constructor() {}

  createPlaylist(userId: string, playlistSongs: PlaylistSongsDto) {}
  findPlaylist(userId: string, playlistId: string) {}
  importPlaylist(userId: string, playlistId: string) {}
}
