import { IHashGateway } from '@/domain/modules/hash/gateways/hash-gateway';
import { BCryptGateway } from '../../hash/gateways/bcrypt.gateway';
import { IUserGateway } from '@/domain/modules/user/gateways/user-gateway';
import { PgKnexUserRepository } from '../../user/gateways/knex/repositories/pg-knex-user.repository';
import { IAuthGateway } from '@/domain/modules/auth/gateways/auth-gateway';
import { JwtAuthGateway } from '../gateways/jwt-auth.gateway';
import { DefaultAuthenticateUseCase } from '@/application/modules/auth/use-cases/authenticate/default-authenticate-use-case';

export function authenticateInjections() {
	const userGateway: IUserGateway = new PgKnexUserRepository();
	const hashGateway: IHashGateway = new BCryptGateway();
	const authenticateGateway: IAuthGateway =
    new JwtAuthGateway();
	const authenticateUseCase = new DefaultAuthenticateUseCase(
		userGateway,
		hashGateway,
		authenticateGateway
	);

	return {
		authenticateUseCase,
	};
}
