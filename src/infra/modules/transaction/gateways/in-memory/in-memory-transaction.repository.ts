import { ITransactionGateway } from '@/domain/modules/transaction/gateways/transaction-gateway';
import { Transaction } from '@/domain/modules/transaction/transaction';
import {
	FindAllTransactionPaginatedParams,
	FindAllTransactionPaginatedResponse,
} from '@/domain/modules/transaction/type/find-all-transaction-paginated';

export class InMemoryTransactionRepository implements ITransactionGateway {
	private transactions: Transaction[];

	constructor() {
		this.transactions = [];
	}
	async findAllPaginated({
		userId,
		page,
	}: FindAllTransactionPaginatedParams): Promise<FindAllTransactionPaginatedResponse> {
		const count = this.transactions.filter((transaction) =>
			userId
				? transaction.getUserId().getValue() === userId.getValue()
				: transaction
		).length;
		const transactions = this.transactions.splice(page);

		return {
			count,
			transactions,
		};
	}

	async create(transaction: Transaction): Promise<Transaction> {
		this.transactions.push(transaction);

		return transaction;
	}
}
