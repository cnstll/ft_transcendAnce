import { UserPayload } from './userPayload.type';

export interface JwtPayload {
  nickname: string;
  id: string;
  immutableId: string;
  isTwoFactorSet: boolean;
}
export interface UserRequest extends Request {
  user: UserPayload;
}
