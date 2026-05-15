import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class PasswordHasher {
  abstract hashPassword(data: string): Promise<string>;
  abstract comparePasswords(data: string, encrypted: string): Promise<boolean>;
}
