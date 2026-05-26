import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthService } from 'src/auth/domain/auth.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { type Response } from 'express';
import { Cookie } from 'src/auth/decorators/cookie.decorator';
import { setRefreshTokenCookie } from 'src/auth/utils/cookie.helper';
import { REFRESH_TOKEN_COOKIE } from 'src/auth/auth.constants';

@Auth(AuthType.None)
@Controller('auth')
export class AuthController {
  readonly #authService: AuthService;

  constructor(authService: AuthService) {
    this.#authService = authService;
  }

  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.#authService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.#authService.signIn(signInDto);

    setRefreshTokenCookie(response, refreshToken);

    return {
      accessToken,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-tokens')
  async refreshTokens(
    @Cookie(REFRESH_TOKEN_COOKIE) oldRefreshToken: string | undefined,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!oldRefreshToken) {
      throw new UnauthorizedException();
    }

    const { accessToken, refreshToken } =
      await this.#authService.refreshTokens(oldRefreshToken);

    setRefreshTokenCookie(response, refreshToken);

    return {
      accessToken,
    };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(REFRESH_TOKEN_COOKIE);
  }
}
