import { Module } from '@nestjs/common';
import { drizzleProvider } from './orm/drizzle.provider';

@Module({
  providers: [drizzleProvider],
  exports: [drizzleProvider],
})
export class DatabaseModule {}
