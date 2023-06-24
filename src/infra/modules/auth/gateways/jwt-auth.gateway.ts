import { GenerateJwtParams, IAuthGateway } from '@/domain/modules/auth/gateways/auth-gateway';
import jsonwebtoken from 'jsonwebtoken';

export class JwtAuthGateway implements IAuthGateway {
	async generateToken({ expiresIn, object, secret }: GenerateJwtParams): Promise<string> {
		return jsonwebtoken.sign(object, secret, { expiresIn });
	}
}