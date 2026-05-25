import { Module } from '@nestjs/common';
import { drizzleProvider } from './orm/drizzle.provider';
import { PgErrorMapper } from './exceptions/pg-errors.mapper';

@Module({
  providers: [drizzleProvider, PgErrorMapper],
  exports: [drizzleProvider, PgErrorMapper],
})
export class DatabaseModule {}
