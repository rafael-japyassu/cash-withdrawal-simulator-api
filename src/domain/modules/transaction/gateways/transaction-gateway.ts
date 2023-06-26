import { Transaction } from '../transaction';
import {
	FindAllTransactionPaginatedParams,
	FindAllTransactionPaginatedResponse,
} from '../type/find-all-transaction-paginated';

export interface ITransactionGateway {
  create(transaction: Transaction): Promise<Transaction>;
  findAllPaginated(
    data: FindAllTransactionPaginatedParams
  ): Promise<FindAllTransactionPaginatedResponse>;
}
