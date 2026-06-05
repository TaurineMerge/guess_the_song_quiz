import { Injectable } from '@nestjs/common';
import { YOUTUBE_BASE_API } from '../youtube.constants';

export interface YoutubePlaylistListResponse {
  items: YoutubePlaylist[];
}

export interface YoutubePlaylist {
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    channelTitle: string;
    thumbnails: Record<
      'default' | 'medium' | 'high' | 'standard' | 'maxres',
      { url: string; width: number; height: number }
    >;
    localized?: {
      title: string;
      description: string;
    };
  };
}

export interface YoutubePlaylistItemsResponse {
  items: PlaylistItem[];
  nextPageToken?: string;
}

export interface PlaylistItem {
  snippet: {
    title: string;
  };
  contentDetails: {
    videoId: string;
  };
}

export interface YoutubeVideosResponse {
  items: VideoItem[];
}

export interface VideoItem {
  id: string;
  contentDetails: {
    duration: string;
  };
}

@Injectable()
export class YoutubeProvider {
  async getPlaylistData(playlistId: string): Promise<YoutubePlaylist | null> {
    const url =
      `${YOUTUBE_BASE_API}/playlists` +
      `?part=snippet` +
      `&id=${playlistId}` +
      `&key=${process.env.GOOGLE_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = (await res.json()) as YoutubePlaylistListResponse;

    return data.items?.[0] ?? null;
  }

  async getPlaylistItems(playlistId: string): Promise<PlaylistItem[] | null> {
    const batchSize = 50;

    let url: string | null =
      `${YOUTUBE_BASE_API}/playlistItems` +
      `?part=snippet,contentDetails` +
      `&playlistId=${playlistId}` +
      `&maxResults=${batchSize}` +
      `&key=${process.env.GOOGLE_API_KEY}`;

    const result: PlaylistItem[] = [];

    while (url) {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = (await res.json()) as YoutubePlaylistItemsResponse;

      result.push(...(data.items ?? []));

      url = data.nextPageToken
        ? `${YOUTUBE_BASE_API}/playlistItems` +
          `?part=snippet,contentDetails` +
          `&playlistId=${playlistId}` +
          `&pageToken=${data.nextPageToken}` +
          `&maxResults=${batchSize}` +
          `&key=${process.env.GOOGLE_API_KEY}`
        : null;
    }

    return result ?? null;
  }

  async getVideos(videoIds: string[]): Promise<VideoItem[]> {
    const result: VideoItem[] = [];

    for (let i = 0; i < videoIds.length; i += 50) {
      const chunk = videoIds.slice(i, i + 50);

      const url =
        `${YOUTUBE_BASE_API}/videos` +
        `?part=snippet,contentDetails,statistics` +
        `&id=${chunk.join(',')}` +
        `&key=${process.env.GOOGLE_API_KEY}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = (await res.json()) as YoutubeVideosResponse;

      result.push(...(data.items ?? []));
    }

    return result ?? null;
  }
}
