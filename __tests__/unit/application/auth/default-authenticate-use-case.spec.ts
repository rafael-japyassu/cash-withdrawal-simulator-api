import { UserEmailPasswordIncorrectException } from '@/application/modules/auth/exceptions/user-email-password-incorrect-exception';
import { AuthenticateCommand } from '@/application/modules/auth/use-cases/authenticate/authenticate-command';
import { AuthenticateUseCase } from '@/application/modules/auth/use-cases/authenticate/authenticate-use-case';
import { DefaultAuthenticateUseCase } from '@/application/modules/auth/use-cases/authenticate/default-authenticate-use-case';
import { CreateUserCommand } from '@/application/modules/user/use-cases/create-user/create-user-command';
import { CreateUserUseCase } from '@/application/modules/user/use-cases/create-user/create-user-use-case';
import { DefaultCreateUserUseCase } from '@/application/modules/user/use-cases/create-user/default-create-user-use-case';
import { IAuthGateway } from '@/domain/modules/auth/gateways/auth-gateway';
import { IHashGateway } from '@/domain/modules/hash/gateways/hash-gateway';
import { IUserGateway } from '@/domain/modules/user/gateways/user-gateway';
import { JwtAuthGateway } from '@/infra/modules/auth/gateways/jwt-auth.gateway';
import { BCryptGateway } from '@/infra/modules/hash/gateways/bcrypt.gateway';
import { InMemoryUserRepository } from '@/infra/modules/user/gateways/in-memory/in-memory-user.repository';
import { beforeEach, describe, expect, it } from 'vitest';

describe('DefaultAuthenticateUseCase', () => {
	let userGateway: IUserGateway;
	let hashGateway: IHashGateway;
	let authGateway: IAuthGateway;
	let createUserUseCase: CreateUserUseCase;
	let authenticateUseCase: AuthenticateUseCase;

	beforeEach(() => {
		userGateway = new InMemoryUserRepository();
		hashGateway = new BCryptGateway();
		authGateway = new JwtAuthGateway();
		createUserUseCase = new DefaultCreateUserUseCase(userGateway, hashGateway);
		authenticateUseCase = new DefaultAuthenticateUseCase(
			userGateway,
			hashGateway,
			authGateway
		);
	});

	it('should be able to authenticate a user', async () => {
		const command: AuthenticateCommand = {
			email: 'johndoe@email.com',
			password: '123123',
		};

		const createUserCommand: CreateUserCommand = {
			name: 'John Doe',
			email: 'johndoe@email.com',
			password: '123123',
		};

		await createUserUseCase.execute(createUserCommand);

		const response = await authenticateUseCase.execute(command);

		expect(response.isLeft()).toBeFalsy();
		expect(response.isRight()).toBeTruthy();
		expect(response.getRight()).toHaveProperty('token');
		expect(response.getRight().user).toEqual({
			name: createUserCommand.name,
			email: createUserCommand.email,
		});
	});
	
	it('should not be able to authenticate a non-user or incorrect email', async () => {
		const command: AuthenticateCommand = {
			email: 'johndoe@email.com',
			password: '123123',
		};

		const response = await authenticateUseCase.execute(command);
		const errorMessages = response.getLeft().getErrors().map(error => error);

		expect(response.isLeft()).toBeTruthy();
		expect(response.isRight()).toBeFalsy();
		expect(response.getLeft().getErrors().length).toBe(1);
		expect(errorMessages).toEqual(expect.arrayContaining([new UserEmailPasswordIncorrectException]));
	});

	it('should not be able to authenticate a user with incorrect password', async () => {
		const command: AuthenticateCommand = {
			email: 'johndoe@email.com',
			password: '123123',
		};

		const createUserCommand: CreateUserCommand = {
			name: 'John Doe',
			email: 'johndoe@email.com',
			password: '63728136',
		};

		await createUserUseCase.execute(createUserCommand);

		const response = await authenticateUseCase.execute(command);
		const errorMessages = response.getLeft().getErrors().map(error => error);

		expect(response.isLeft()).toBeTruthy();
		expect(response.isRight()).toBeFalsy();
		expect(response.getLeft().getErrors().length).toBe(1);
		expect(errorMessages).toEqual(expect.arrayContaining([new UserEmailPasswordIncorrectException]));
	});
});
