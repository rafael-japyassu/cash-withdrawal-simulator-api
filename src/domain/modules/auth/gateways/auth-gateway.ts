export type GenerateJwtParams = {
  object: object | string | Buffer;
  expiresIn: string | number;
  secret: string;
};

export interface IAuthGateway {
  generateJwt(params: GenerateJwtParams): Promise<string>;
}