import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

export const ActiveUser = createParamDecorator(
  (field: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const client = ctx.switchToWs().getClient<Socket>();
    const user = (client.data as { user: JwtPayload }).user;
    if (field) {
      const value = user[field];
      if (value === undefined) {
        throw new WsException(`Field "${field}" not found in token`);
      }
      return value;
    }
    return user;
  },
);
