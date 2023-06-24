import { GenerateJwtParams, IAuthGateway, VerifyJwtParams, VerifyJwtResponse } from '@/domain/modules/auth/gateways/auth-gateway';
import jsonwebtoken from 'jsonwebtoken';

export class JwtAuthGateway implements IAuthGateway {
	async generateToken({ expiresIn, object, secret }: GenerateJwtParams): Promise<string> {
		return jsonwebtoken.sign(object, secret, { expiresIn });
	}

	async verify({ secret, token }: VerifyJwtParams): Promise<VerifyJwtResponse> {
		return jsonwebtoken.verify(token, secret) as unknown as VerifyJwtResponse;
	}
}