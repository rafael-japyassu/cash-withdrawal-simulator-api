import { ITransactionGateway } from '@/domain/modules/transaction/gateways/transaction-gateway';
import { Transaction } from '@/domain/modules/transaction/transaction';

export class InMemoryTransactionRepository implements ITransactionGateway {

	private transactions: Transaction[];

	constructor() {
		this.transactions = [];
	}

	async create(transaction: Transaction): Promise<Transaction> {
		this.transactions.push(transaction);

		return transaction;
	}
}