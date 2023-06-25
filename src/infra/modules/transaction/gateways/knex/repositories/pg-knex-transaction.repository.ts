import { ITransactionGateway } from '@/domain/modules/transaction/gateways/transaction-gateway';
import { Transaction } from '@/domain/modules/transaction/transaction';
import { knexConnection } from '@/infra/config/database/knex';
import { Knex } from 'knex';

const TRANSACTION_TABLE = 'transactions';
interface TransactionKnex {
  id: string;
  title: string;
  user_id: string;
  type: string;
  value: number;
  created_at: Date;
  updated_at: Date;
}

export class PgKnexTransactionRepository implements ITransactionGateway {
	private transactionRepository: Knex.QueryBuilder;

	constructor() {
		this.transactionRepository = knexConnection<TransactionKnex>(TRANSACTION_TABLE);
	}
  
	async create(transaction: Transaction): Promise<Transaction> {
		await this.transactionRepository.insert(this.aggregateToEntity(transaction));

		return transaction;
	}

	private aggregateToEntity(transaction: Transaction): TransactionKnex {
		return {
			id: transaction.getId().getValue(),
			title: transaction.getTitle(),
			type: transaction.getType(),
			value: transaction.getValue(),
			user_id: transaction.getUserId().getValue(),
			created_at: transaction.getCreatedAt(),
			updated_at: transaction.getUpdatedAt(),
		};
	}
}
