import { sql } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  uuid,
  integer,
  check,
  unique,
} from 'drizzle-orm/pg-core';
import { users } from 'src/users/schema';

export const playlists = pgTable('playlists', {
  playlistId: uuid('playlist_id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.userId, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  title: varchar({ length: 255 }).notNull(),
});

export const playlistSongs = pgTable(
  'playlist_songs',
  {
    playlistSongId: uuid('playlist_song_id').primaryKey().defaultRandom(),
    playlistId: uuid('playlist_id')
      .notNull()
      .references(() => playlists.playlistId, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    songLinkId: varchar('song_link_id', { length: 11 }).notNull(),
    title: varchar({ length: 255 }).notNull(),
    artist: varchar({ length: 255 }).notNull(),
    durationSeconds: integer('duration_seconds').notNull(),
    normalizedTitleArtist: varchar('normalized_title_artist', {
      length: 511,
    }).notNull(),
    position: integer().notNull(),
  },
  (table) => [
    check('duration_seconds_check', sql`${table.durationSeconds} > 0`),
    check('song_position_check', sql`${table.position} >= 0`),
    unique().on(table.playlistId, table.songLinkId),
  ],
);
