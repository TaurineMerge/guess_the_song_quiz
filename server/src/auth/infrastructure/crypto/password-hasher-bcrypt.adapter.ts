import { PasswordHasher } from 'src/auth/domain/ports/password-hasher.port';
import { hash, genSalt, compare } from 'bcrypt';

export class BcryptPasswordHasher implements PasswordHasher {
  async hashPassword(data: string): Promise<string> {
    const salt = await genSalt();
    return hash(data, salt);
  }
  comparePasswords(data: string, encrypted: string): Promise<boolean> {
    return compare(data, encrypted);
  }
}
