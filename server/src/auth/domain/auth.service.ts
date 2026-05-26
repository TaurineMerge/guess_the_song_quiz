import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PasswordHasher } from './ports/password-hasher.port';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { type ConfigType } from '@nestjs/config';
import { eq } from 'drizzle-orm';
import jwtConfig from 'src/common/infrastructure/config/jwt.config';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from 'src/common/infrastructure/database/orm/drizzle.provider';
import { SignUpDto } from '../presenter/http/dto/sign-up.dto';
import { SignInDto } from '../presenter/http/dto/sign-in.dto';
import { PgErrorMapper } from 'src/common/infrastructure/database/exceptions/pg-errors.mapper';
import { users } from 'src/users/schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly passwordHasher: PasswordHasher,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase,
    private readonly pgErrorMapper: PgErrorMapper,
  ) {}

  async signUp({ username, email, password }: SignUpDto) {
    try {
      const passwordHash = await this.passwordHasher.hashPassword(password);
      const result = await this.db
        .insert(users)
        .values({
          username,
          email,
          passwordHash,
        })
        .returning({ insertedId: users.userId });
      const newUserId = result[0].insertedId;

      return newUserId;
    } catch (error) {
      this.pgErrorMapper.map(error);
    }
  }

  async signIn({ email, password }: SignInDto) {
    const [user] = await this.db
      .select({
        userId: users.userId,
        username: users.username,
        email: users.email,
        passwordHash: users.passwordHash,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user?.passwordHash)
      throw new UnauthorizedException('Invalid credentials');

    const isEqual = await this.passwordHasher.comparePasswords(
      password,
      user.passwordHash,
    );

    if (!isEqual) throw new UnauthorizedException('Invalid credentials');

    const jwtPayload = { sub: user.userId, email: user.email };
    const jwtOptions: JwtSignOptions = {
      audience: this.jwtConfiguration.audience,
      issuer: this.jwtConfiguration.issuer,
      secret: this.jwtConfiguration.secret,
      expiresIn: this.jwtConfiguration.accessTokenTtl,
    };

    const accessToken = await this.jwtService.signAsync(jwtPayload, jwtOptions);

    return { accessToken };
  }
}
