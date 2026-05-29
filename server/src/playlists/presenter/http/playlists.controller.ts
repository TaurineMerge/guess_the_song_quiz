import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

import { PlaylistSongsDto } from './dto/playlist-songs-metadata.dto';
import { PlaylistService } from 'src/playlists/domain/playlist.service';

@Auth(AuthType.Bearer)
@Controller('playlists')
export class PlaylistsController {
  readonly #playlistService: PlaylistService;

  constructor(playlistService: PlaylistService) {
    this.#playlistService = playlistService;
  }

  @Post()
  createPlaylist(
    @ActiveUser('sub') userId: string,
    @Body() playlistSongs: PlaylistSongsDto,
  ) {
    return this.#playlistService.createPlaylist(userId, playlistSongs);
  }

  @Get(':playlistId')
  findPlaylist(
    @ActiveUser('sub') userId: string,
    @Param('playlistId') playlistId: string,
  ) {
    return this.#playlistService.findPlaylist(userId, playlistId);
  }

  @Post('import')
  importPlaylist(
    @ActiveUser('sub') userId: string,
    @Body() playlistId: string,
  ) {
    return this.#playlistService.importPlaylist(userId, playlistId);
  }
}
