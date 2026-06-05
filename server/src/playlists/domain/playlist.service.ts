import { Injectable } from '@nestjs/common';
import { PlaylistSongsDto } from '../presenter/http/dto/playlist-songs-metadata.dto';
import { YoutubeService } from 'src/youtube/domain/youtube.service';

@Injectable()
export class PlaylistService {
  constructor(private readonly youtubeService: YoutubeService) {}

  createPlaylist(userId: string, playlistSongs: PlaylistSongsDto) {}
  findPlaylist(userId: string, playlistId: string) {}
  async importPlaylist(userId: string, playlistId: string) {
    return await this.youtubeService.getPlaylist(userId, playlistId);
  }
}
