import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { users } from 'src/users/schema';

export const DRIZZLE = Symbol('DRIZZLE');
export const drizzleProvider = {
  provide: DRIZZLE,
  useFactory: (configService: ConfigService) => {
    const pool = new Pool({
      connectionString: configService.getOrThrow('DATABASE_URL'),
    });

    return drizzle(pool, {
      schema: { ...users },
    });
  },
  inject: [ConfigService],
};
