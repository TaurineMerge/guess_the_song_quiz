import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthService } from 'src/auth/domain/auth.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { RefreshTokenDto } from './dto/refresh-token.dto';

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
  signIn(@Body() signInDto: SignInDto) {
    return this.#authService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-tokens')
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.#authService.refreshTokens(refreshTokenDto);
  }
}
