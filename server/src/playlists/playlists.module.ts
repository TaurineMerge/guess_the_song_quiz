import { Module } from '@nestjs/common';
import { PlaylistService } from './domain/playlist.service';
import { YoutubeModule } from 'src/youtube/youtube.module';
import { PlaylistsController } from './presenter/http/playlists.controller';

@Module({
  imports: [YoutubeModule],
  providers: [PlaylistService],
  controllers: [PlaylistsController],
  exports: [PlaylistService],
})
export class PlaylistModule {}
