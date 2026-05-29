import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST_USER_KEY } from '../auth.constants';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

export const ActiveUser = createParamDecorator(
  (field: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const jwtUserData: JwtPayload | undefined = request[REQUEST_USER_KEY];
    if (!jwtUserData) throw new UnauthorizedException();
    if (field) {
      const value = jwtUserData[field];
      if (value === undefined) {
        throw new UnauthorizedException(`Field "${field}" not found in token`);
      }
      return value;
    }
    return jwtUserData;
  },
);
