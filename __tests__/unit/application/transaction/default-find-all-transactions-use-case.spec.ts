import { DefaultFindAllTransactionsUseCase } from '@/application/modules/transaction/use-cases/find-all-transactions/default-find-all-transactions-use-case';
import { FindAllTransactionsCommand } from '@/application/modules/transaction/use-cases/find-all-transactions/find-all-transactions-command';
import { FindAllTransactionsUseCase } from '@/application/modules/transaction/use-cases/find-all-transactions/find-all-transactions-use-case';
import { DefaultWithdrawalMoneyUseCase } from '@/application/modules/transaction/use-cases/withdrawal-money/default-withdrawal-money-use-case';
import { WithdrawalMoneyCommand } from '@/application/modules/transaction/use-cases/withdrawal-money/withdrawal-money-command';
import { WithdrawalMoneyUseCase } from '@/application/modules/transaction/use-cases/withdrawal-money/withdrawal-money-use-case';
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
	let findAllTransactionsUseCase: FindAllTransactionsUseCase;

	beforeEach(() => {
		transactionGateway = new InMemoryTransactionRepository();
		hashGateway = new BCryptGateway();
		userGateway = new InMemoryUserRepository();
		createUserUseCase = new DefaultCreateUserUseCase(userGateway, hashGateway);
		withdrawMoneyUseCase = new DefaultWithdrawalMoneyUseCase(
			transactionGateway,
			userGateway
		);
		findAllTransactionsUseCase = new DefaultFindAllTransactionsUseCase(
			transactionGateway
		);
	});

	it('should be able to find all transactions', async () => {
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

		await withdrawMoneyUseCase.execute(withdrawalMoneyCommand);

		const params: FindAllTransactionsCommand = {
			userId: user.id,
			page: 1,
			size: 20,
		};

		const responseFindAllTransactions =
      await findAllTransactionsUseCase.execute(params);

		expect(responseFindAllTransactions.isLeft()).toBeFalsy();
		expect(responseFindAllTransactions.isRight()).toBeTruthy();
		expect(responseFindAllTransactions.getRight().content.length).toBe(1);
		expect(responseFindAllTransactions.getRight()).toEqual(
			expect.objectContaining({
				totalPages: 1,
				elementsInPage: 1,
				firstPage: true,
				lastPage: true,
				page: 1,
				size: 20,
				totalElements: 1,
			})
		);
	});
});
