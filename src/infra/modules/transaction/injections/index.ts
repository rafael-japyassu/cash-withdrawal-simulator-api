import { ITransactionGateway } from '@/domain/modules/transaction/gateways/transaction-gateway';
import { PgKnexTransactionRepository } from '../gateways/knex/repositories/pg-knex-transaction.repository';
import { DefaultWithdrawalMoneyUseCase } from '@/application/modules/transaction/use-cases/withdrawal-money/default-withdrawal-money-use-case';
import { PgKnexUserRepository } from '../../user/gateways/knex/repositories/pg-knex-user.repository';
import { IUserGateway } from '@/domain/modules/user/gateways/user-gateway';
import { DefaultFindAllTransactionsUseCase } from '@/application/modules/transaction/use-cases/find-all-transactions/default-find-all-transactions-use-case';

export function transactionInjections() {
	const transactionGateway: ITransactionGateway =
    new PgKnexTransactionRepository();
	const userGateway: IUserGateway = new PgKnexUserRepository();
	const withdrawalMoneyUseCase = new DefaultWithdrawalMoneyUseCase(
		transactionGateway,
		userGateway
	);

	const findAllTransactionsUseCase = new DefaultFindAllTransactionsUseCase(transactionGateway);

	return {
		withdrawalMoneyUseCase,
		findAllTransactionsUseCase
	};
}
