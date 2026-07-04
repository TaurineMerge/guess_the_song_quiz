import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient();

    try {
      const token = client.handshake.auth.token as string;
      const user = this.jwtService.verify<JwtPayload>(token);
      (client.data as { user: JwtPayload }).user = user;
    } catch {
      client.disconnect();
      throw new WsException('Unauthorized');
    }

    return true;
  }
}
