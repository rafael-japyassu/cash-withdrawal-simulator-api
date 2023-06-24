export type GenerateJwtParams = {
  object: object | string | Buffer;
  expiresIn: string | number;
  secret: string;
};

export type VerifyJwtParams = {
  token: string;
  secret: string;
};

export type VerifyJwtResponse = {
  id: string;
  iat: number;
  exp: number;
};

export interface IAuthGateway {
  generateToken(params: GenerateJwtParams): Promise<string>;
  verify(params: VerifyJwtParams): Promise<VerifyJwtResponse>;
}