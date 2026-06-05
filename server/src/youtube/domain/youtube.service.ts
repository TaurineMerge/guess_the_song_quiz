import { Injectable } from '@nestjs/common';
import { YoutubeProvider } from '../infrastructure/youtube.provider';
import { durationToSeconds } from '../infrastructure/iso-parser.helper';

export interface VideoValue {
  videoTitle: string;
  durationSeconds: number | null;
}

@Injectable()
export class YoutubeService {
  constructor(private readonly youtubeProvider: YoutubeProvider) {}

  async getPlaylist(userId: string, playlistId: string) {
    const videos = new Map<string, VideoValue>();

    const playlistData = await this.youtubeProvider.getPlaylistData(playlistId);

    if (!playlistData) throw new Error('Error getting playlist data');

    const playlistItemsData =
      await this.youtubeProvider.getPlaylistItems(playlistId);

    if (!playlistItemsData)
      throw new Error('Error getting playlist items data');

    const videoIds: Array<string> = [];
    for (const item of playlistItemsData) {
      const videoId = item.contentDetails.videoId;
      const videoValue = {
        videoTitle: item.snippet.title,
        durationSeconds: null,
      };

      videos.set(videoId, videoValue);
      videoIds.push(videoId);
    }

    const videosData = await this.youtubeProvider.getVideos(videoIds);

    if (!videosData) throw new Error('Error getting videos data');

    for (const videoData of videosData) {
      const entry = videos.get(videoData.id);

      if (entry) {
        entry.durationSeconds = durationToSeconds(
          videoData.contentDetails.duration,
        );
      }
    }

    const result = {
      playlistId: playlistData.id,
      playlistTitle: playlistData.snippet.title,
      channelTitle: playlistData.snippet.channelTitle,
      ownerId: userId,
      videos: Array.from(videos.entries(), ([videoId, value]) => ({
        videoId,
        ...value,
      })),
    };

    return result;
  }
}
