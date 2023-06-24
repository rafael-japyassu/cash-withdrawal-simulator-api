import { IAuthGateway } from '@/domain/modules/auth/gateways/auth-gateway';
import { IHttpMiddleware } from '@/infra/http/types/http-middleware';
import { UnauthorizedException } from '../exceptions/unauthorized-exception';
import { InvalidJwtException } from '../exceptions/invalid-jwt-exception';

type AuthenticateMiddlewareInput = {
  token: string | undefined;
  request: any;
};

export class AuthenticateMiddleware
implements IHttpMiddleware<AuthenticateMiddlewareInput>
{
	constructor(private readonly authenticateGateway: IAuthGateway) {}

	async execute({
		token,
		request,
	}: AuthenticateMiddlewareInput): Promise<void> {
		if (!token) {
			throw new UnauthorizedException();
		}

		const [, jwtToken] = token.split(' ');

		try {
			const response = await this.authenticateGateway.verify({
				token: jwtToken,
				secret: String(process.env.JWT_SECRET),
			});

			request.user = {
				id: response.id,
			};
		} catch {
			throw new InvalidJwtException();
		}
	}
}
