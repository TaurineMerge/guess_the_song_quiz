import { Response } from 'express';

export function setRefreshTokenCookie(
  response: Response,
  refreshToken: string,
) {
  response.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
}
