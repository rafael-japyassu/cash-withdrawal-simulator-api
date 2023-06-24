import { DefaultWithdrawMoneyUseCase } from '@/application/modules/transaction/use-cases/withdraw-money/default-withdraw-money-use-case';
import { WithdrawMoneyCommand } from '@/application/modules/transaction/use-cases/withdraw-money/withdraw-money-command';
import { WithdrawMoneyUseCase } from '@/application/modules/transaction/use-cases/withdraw-money/withdraw-money-use-case';
import { UserNotFoundException } from '@/application/modules/user/exceptions/user-not-found-exception';
import { CreateUserCommand } from '@/application/modules/user/use-cases/create-user/create-user-command';
import { CreateUserUseCase } from '@/application/modules/user/use-cases/create-user/create-user-use-case';
import { DefaultCreateUserUseCase } from '@/application/modules/user/use-cases/create-user/default-create-user-use-case';
import { IHashGateway } from '@/domain/modules/hash/gateways/hash-gateway';
import { ITransactionGateway } from '@/domain/modules/transaction/gateways/transaction-gateway';
import { IUserGateway } from '@/domain/modules/user/gateways/user-gateway';
import { BCryptGateway } from '@/infra/modules/hash/gateways/bcrypt.gateway';
import { InMemoryTransactionRepository } from '@/infra/modules/transaction/gateways/in-memory/in-memory-transaction.repository';
import { InMemoryUserRepository } from '@/infra/modules/user/gateways/in-memory/in-memory-user.repository';
import { beforeEach, describe, expect, it } from 'vitest';

describe('DefaultWithdrawMoneyUseCase', () => {
	let transactionGateway: ITransactionGateway;
	let userGateway: IUserGateway;
	let hashGateway: IHashGateway;
	let createUserUseCase: CreateUserUseCase;
	let withdrawMoneyUseCase: WithdrawMoneyUseCase;

	beforeEach(() => {
		transactionGateway = new InMemoryTransactionRepository();
		hashGateway = new BCryptGateway();
		userGateway = new InMemoryUserRepository();
		createUserUseCase = new DefaultCreateUserUseCase(userGateway, hashGateway);
		withdrawMoneyUseCase = new DefaultWithdrawMoneyUseCase(transactionGateway, userGateway);
	});

	it('should be able to create a valid Withdraw', async () => {
		const createUserCommand: CreateUserCommand = {
			name: 'John Doe',
			email: 'johndoe@email.com',
			password: '123123'
		};

		const responseUser = await createUserUseCase.execute(createUserCommand);

		const user = responseUser.getRight();

		const withdrawMoneyCommand: WithdrawMoneyCommand = {
			userId: user.id,
			value: 1000
		};
		
		const responseWithdraw = await withdrawMoneyUseCase.execute(withdrawMoneyCommand);

		expect(responseWithdraw.isLeft()).toBeFalsy();
		expect(responseWithdraw.isRight()).toBeTruthy();
		expect(typeof responseWithdraw.getRight().transactionId === 'string').toBeTruthy();
		expect(responseWithdraw.getRight().currentValue).toBe(9000);
	});

	it('should not be able to create a valid Withdraw a non-use', async () => {
		const withdrawMoneyCommand: WithdrawMoneyCommand = {
			userId: 'non-user',
			value: 1000
		};
		
		const responseWithdraw = await withdrawMoneyUseCase.execute(withdrawMoneyCommand);

		const errorMessages = responseWithdraw.getLeft().getErrors().map(error => error);

		expect(responseWithdraw.isLeft()).toBeTruthy();
		expect(responseWithdraw.isRight()).toBeFalsy();
		expect(responseWithdraw.getLeft().getErrors().length).toBe(1);
		expect(errorMessages).toEqual(expect.arrayContaining([new UserNotFoundException]));
	});

	it('should be able to create a valid Withdraw with a invalid user balance result', async () => {
		const createUserCommand: CreateUserCommand = {
			name: 'John Doe',
			email: 'johndoe@email.com',
			password: '123123'
		};

		const responseUser = await createUserUseCase.execute(createUserCommand);

		const user = responseUser.getRight();

		const withdrawMoneyCommand: WithdrawMoneyCommand = {
			userId: user.id,
			value: 15000
		};
		
		const responseWithdraw = await withdrawMoneyUseCase.execute(withdrawMoneyCommand);

		const expectErrorMessage = '"balance" cannot be less than 0';
		const errorMessages = responseWithdraw.getLeft().getErrors().map(error => error.message);

		expect(responseWithdraw.isLeft()).toBeTruthy();
		expect(responseWithdraw.isRight()).toBeFalsy();
		expect(responseWithdraw.getLeft().getErrors().length).toBe(1);
		expect(errorMessages).toEqual(expect.arrayContaining([expectErrorMessage]));
	});
});
