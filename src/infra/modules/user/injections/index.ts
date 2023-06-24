import { DefaultCreateUserUseCase } from '@/application/modules/user/use-cases/create-user/default-create-user-use-case';
import { IHashGateway } from '@/domain/modules/hash/gateways/hash-gateway';
import { IUserGateway } from '@/domain/modules/user/gateways/user-gateway';
import { BCryptGateway } from '../../hash/gateways/bcrypt.gateway';
import { PgKnexUserRepository } from '../gateways/knex/repositories/pg-knex-user.repository';

export function userInjections() {
	const userGateway: IUserGateway = new PgKnexUserRepository();
	const hashGateway: IHashGateway = new BCryptGateway();
	const createUserUseCase = new DefaultCreateUserUseCase(userGateway, hashGateway);

	return {
		createUserUseCase
	};
}
