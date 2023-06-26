import { ITransactionGateway } from '@/domain/modules/transaction/gateways/transaction-gateway';
import { Transaction } from '@/domain/modules/transaction/transaction';
import { FindAllTransactionPaginatedParams, FindAllTransactionPaginatedResponse } from '@/domain/modules/transaction/type/find-all-transaction-paginated';

export class InMemoryTransactionRepository implements ITransactionGateway {

	private transactions: Transaction[];

	constructor() {
		this.transactions = [];
	}
	async findAllPaginated(_: FindAllTransactionPaginatedParams): Promise<FindAllTransactionPaginatedResponse> {
		return {
			count: this.transactions.length,
			transactions: this.transactions
		};
	}

	async create(transaction: Transaction): Promise<Transaction> {
		this.transactions.push(transaction);

		return transaction;
	}
}