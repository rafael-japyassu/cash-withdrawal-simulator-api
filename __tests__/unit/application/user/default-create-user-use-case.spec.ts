import { UserEmailAlreadyExistsException } from '@/application/modules/user/exceptions/user-email-already-exists-exception';
import { CreateUserCommand } from '@/application/modules/user/use-cases/create-user/create-user-command';
import { CreateUserUseCase } from '@/application/modules/user/use-cases/create-user/create-user-use-case';
import { DefaultCreateUserUseCase } from '@/application/modules/user/use-cases/create-user/default-create-user-use-case';
import { IHashGateway } from '@/domain/modules/hash/gateways/hash-gateway';
import { IUserGateway } from '@/domain/modules/user/gateways/user-gateway';
import { BCryptGateway } from '@/infra/modules/hash/gateways/bcrypt.gateway';
import { InMemoryUserRepository } from '@/infra/modules/user/gateways/in-memory/in-memory-user.repository';
import { beforeEach, describe, expect, it } from 'vitest';

describe('DefaultCreateUserUseCase', () => {
	let userGateway: IUserGateway;
	let hashGateway: IHashGateway;
	let createUser: CreateUserUseCase;

	beforeEach(() => {
		userGateway = new InMemoryUserRepository();
		hashGateway = new BCryptGateway();
		createUser = new DefaultCreateUserUseCase(userGateway, hashGateway);
	});

	it('should be able to create a valid user', async () => {
		const command: CreateUserCommand = {
			name: 'John Doe',
			email: 'johndoe@email.com',
			password: '123123'
		};

		const user = await createUser.execute(command);

		expect(user.isLeft()).toBe(false);
		expect(user.isRight()).toBe(true);
		expect(typeof user.getRight().id === 'string').toBe(true);
	});

	it('should not be able to create a user with invalid params', async () => {
		const command: CreateUserCommand = {
			name: '',
			email: 'johndoe@email.com',
			password: '123123'
		};

		const response = await createUser.execute(command);

		expect(response.isLeft()).toBe(true);
		expect(response.isRight()).toBe(false);
		expect(response.getLeft().hasErrors()).toBe(true);
		expect(response.getLeft().getErrors().length).toBe(3);
	});

	it('should not be able to create a user with a duplicated email', async () => {
		const command1: CreateUserCommand = {
			name: 'John Doe 1',
			email: 'johndoe1@email.com',
			password: '123123'
		};

		await createUser.execute(command1);

		const command2: CreateUserCommand = {
			name: 'John Doe 2',
			email: 'johndoe1@email.com',
			password: '123123'
		};

		const response = await createUser.execute(command2);

		expect(response.isLeft()).toBe(true);
		expect(response.isRight()).toBe(false);
		expect(response.getLeft().hasErrors()).toBe(true);
		expect(response.getLeft().getErrors().length).toBe(1);
		expect(response.getLeft().getErrors()).toEqual(expect.arrayContaining([new UserEmailAlreadyExistsException]));
	});
});
