import { InvalidAmountBankWithdrawalException } from '@/application/modules/transaction/exceptions/invalid-amount-bank-withdrawal-exception';
import { DefaultWithdrawalMoneyUseCase } from '@/application/modules/transaction/use-cases/withdrawal-money/default-withdrawal-money-use-case';
import { WithdrawalMoneyCommand } from '@/application/modules/transaction/use-cases/withdrawal-money/withdrawal-money-command';
import { WithdrawalMoneyUseCase } from '@/application/modules/transaction/use-cases/withdrawal-money/withdrawal-money-use-case';
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

describe('DefaultWithdrawalMoneyUseCase', () => {
	let transactionGateway: ITransactionGateway;
	let userGateway: IUserGateway;
	let hashGateway: IHashGateway;
	let createUserUseCase: CreateUserUseCase;
	let withdrawMoneyUseCase: WithdrawalMoneyUseCase;

	beforeEach(() => {
		transactionGateway = new InMemoryTransactionRepository();
		hashGateway = new BCryptGateway();
		userGateway = new InMemoryUserRepository();
		createUserUseCase = new DefaultCreateUserUseCase(userGateway, hashGateway);
		withdrawMoneyUseCase = new DefaultWithdrawalMoneyUseCase(
			transactionGateway,
			userGateway
		);
	});

	it('should be able to create a valid Withdraw', async () => {
		const createUserCommand: CreateUserCommand = {
			name: 'John Doe',
			email: 'johndoe@email.com',
			password: '123123',
		};

		const responseUser = await createUserUseCase.execute(createUserCommand);

		const user = responseUser.getRight();

		const withdrawalMoneyCommand: WithdrawalMoneyCommand = {
			userId: user.id,
			value: 470,
		};

		const responseWithdraw = await withdrawMoneyUseCase.execute(
			withdrawalMoneyCommand
		);

		expect(responseWithdraw.isLeft()).toBeFalsy();
		expect(responseWithdraw.isRight()).toBeTruthy();
		expect(
			typeof responseWithdraw.getRight().transactionId === 'string'
		).toBeTruthy();
		expect(responseWithdraw.getRight().currentValue).toBe(9530);
		expect(responseWithdraw.getRight().notes).toEqual(
			expect.arrayContaining([
				{
					note: '100',
					quantity: 4,
				},
				{
					note: '50',
					quantity: 1,
				},
				{
					note: '20',
					quantity: 1,
				},
			])
		);
	});

	it('should not be able to create a valid Withdraw a invalid value', async () => {
		const withdrawalMoneyCommand: WithdrawalMoneyCommand = {
			userId: 'non-user',
			value: 15,
		};

		const responseWithdraw = await withdrawMoneyUseCase.execute(
			withdrawalMoneyCommand
		);

		const errorMessages = responseWithdraw
			.getLeft()
			.getErrors()
			.map((error) => error);

		expect(responseWithdraw.isLeft()).toBeTruthy();
		expect(responseWithdraw.isRight()).toBeFalsy();
		expect(responseWithdraw.getLeft().getErrors().length).toBe(1);
		expect(errorMessages).toEqual(
			expect.arrayContaining([new InvalidAmountBankWithdrawalException()])
		);
	});

	it('should not be able to create a valid Withdraw a non-use', async () => {
		const withdrawalMoneyCommand: WithdrawalMoneyCommand = {
			userId: 'non-user',
			value: 1000,
		};

		const responseWithdraw = await withdrawMoneyUseCase.execute(
			withdrawalMoneyCommand
		);

		const errorMessages = responseWithdraw
			.getLeft()
			.getErrors()
			.map((error) => error);

		expect(responseWithdraw.isLeft()).toBeTruthy();
		expect(responseWithdraw.isRight()).toBeFalsy();
		expect(responseWithdraw.getLeft().getErrors().length).toBe(1);
		expect(errorMessages).toEqual(
			expect.arrayContaining([new UserNotFoundException()])
		);
	});

	it('should be able to create a valid Withdraw with a invalid user balance result', async () => {
		const createUserCommand: CreateUserCommand = {
			name: 'John Doe',
			email: 'johndoe@email.com',
			password: '123123',
		};

		const responseUser = await createUserUseCase.execute(createUserCommand);

		const user = responseUser.getRight();

		const WithdrawalMoneyCommand: WithdrawalMoneyCommand = {
			userId: user.id,
			value: 15000,
		};

		const responseWithdraw = await withdrawMoneyUseCase.execute(
			WithdrawalMoneyCommand
		);

		const expectErrorMessage = '"balance" cannot be less than 0';
		const errorMessages = responseWithdraw
			.getLeft()
			.getErrors()
			.map((error) => error.message);

		expect(responseWithdraw.isLeft()).toBeTruthy();
		expect(responseWithdraw.isRight()).toBeFalsy();
		expect(responseWithdraw.getLeft().getErrors().length).toBe(1);
		expect(errorMessages).toEqual(expect.arrayContaining([expectErrorMessage]));
	});
});
