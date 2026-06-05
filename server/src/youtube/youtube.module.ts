import { Module } from '@nestjs/common';
import { YoutubeService } from './domain/youtube.service';
import { YoutubeProvider } from './infrastructure/youtube.provider';

@Module({
  providers: [YoutubeService, YoutubeProvider],
  exports: [YoutubeService],
})
export class YoutubeModule {}
