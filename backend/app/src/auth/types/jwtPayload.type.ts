export interface JwtPayload {
  nickname: string;
  id: string;
  immutableId: string;
  isTwoFactorSet: boolean;
}
