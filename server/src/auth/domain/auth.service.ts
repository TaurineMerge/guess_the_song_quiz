import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PasswordHasher } from './ports/password-hasher.port';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { type ConfigType } from '@nestjs/config';
import { eq } from 'drizzle-orm';
import jwtConfig from 'src/auth/config/jwt.config';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from 'src/common/infrastructure/database/orm/drizzle.provider';
import { SignUpDto } from '../presenter/http/dto/sign-up.dto';
import { SignInDto } from '../presenter/http/dto/sign-in.dto';
import { PgErrorMapper } from 'src/common/infrastructure/database/exceptions/pg-errors.mapper';
import { users } from 'src/users/schema';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { RefreshTokenDto } from '../presenter/http/dto/refresh-token.dto';

type UserData = typeof users.$inferSelect;

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

    return await this.generateTokens(user);
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync<
        Pick<JwtPayload, 'sub'>
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });
      const [user] = await this.db
        .select({
          userId: users.userId,
          email: users.email,
          username: users.username,
          passwordHash: users.passwordHash,
        })
        .from(users)
        .where(eq(users.userId, sub))
        .limit(1);

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException();
    }
  }

  async generateTokens(user: UserData) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<JwtPayload>>(
        user.userId,
        this.jwtConfiguration.accessTokenTtl,
        { email: user.email },
      ),
      this.signToken(user.userId, this.jwtConfiguration.refreshTokenTtl),
    ]);

    return { accessToken, refreshToken };
  }

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    const jwtPayload = { sub: userId, ...payload };
    const jwtOptions: JwtSignOptions = {
      audience: this.jwtConfiguration.audience,
      issuer: this.jwtConfiguration.issuer,
      secret: this.jwtConfiguration.secret,
      expiresIn,
    };

    return await this.jwtService.signAsync(jwtPayload, jwtOptions);
  }
}
