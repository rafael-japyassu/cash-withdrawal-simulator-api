import { ITransactionGateway } from '@/domain/modules/transaction/gateways/transaction-gateway';
import { Transaction } from '@/domain/modules/transaction/transaction';
import {
	FindAllTransactionPaginatedParams,
	FindAllTransactionPaginatedResponse,
} from '@/domain/modules/transaction/type/find-all-transaction-paginated';
import { TransactionType } from '@/domain/modules/transaction/type/transaction-type';
import { knexConnection } from '@/infra/config/database/knex';

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
	async create(transaction: Transaction): Promise<Transaction> {
		await knexConnection<TransactionKnex>(TRANSACTION_TABLE).insert(
			this.aggregateToEntity(transaction)
		);

		return transaction;
	}

	async findAllPaginated({
		page,
		size,
		userId,
	}: FindAllTransactionPaginatedParams): Promise<FindAllTransactionPaginatedResponse> {

		const [countData, transactionsKnex] = await Promise.all([
			knexConnection<TransactionKnex>(TRANSACTION_TABLE)
				.count('id')
				.where({ ...(userId && { user_id: userId.getValue() }) })
				.first(),
			knexConnection<TransactionKnex>(TRANSACTION_TABLE)
				.offset(page)
				.limit(size)
				.orderBy('created_at', 'desc')
				.where({ ...(userId && { user_id: userId.getValue() }) }),
		]);

		const transactions = transactionsKnex.map(this.entityToAggregate);

		return { count: Number(countData?.count || 0), transactions };
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

	private entityToAggregate({
		created_at,
		id,
		title,
		type,
		updated_at,
		user_id,
		value,
	}: TransactionKnex): Transaction {
		return Transaction.toAggregate({
			id,
			userId: user_id,
			createdAt: created_at,
			title,
			type: type as TransactionType,
			updatedAt: updated_at,
			value,
		});
	}
}
