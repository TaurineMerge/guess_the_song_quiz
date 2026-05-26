import { REQUEST_USER_KEY } from '../auth.constants';
import { JwtPayload } from './jwt-payload.interface';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  [REQUEST_USER_KEY]?: JwtPayload;
}
