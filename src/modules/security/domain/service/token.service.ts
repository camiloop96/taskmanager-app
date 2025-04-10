export interface TokenService {
  createToken(payload: object): string;
  verifyToken(token: string): object | null;
  decodeToken(token: string): object | null;
}
