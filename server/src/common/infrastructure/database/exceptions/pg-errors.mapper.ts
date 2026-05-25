import { ConflictException, Injectable } from '@nestjs/common';

type PgError = {
  code: string;
};

function isPgError(error: unknown): error is PgError {
  return (
    typeof error === 'object' &&
    error !== null &&
    typeof (error as Record<string, unknown>).code === 'string'
  );
}

@Injectable()
export class PgErrorMapper {
  map(error: unknown): never {
    if (isPgError(error) && error.code === '23505') {
      throw new ConflictException();
    }

    throw error;
  }
}
