import { Transaction } from '../transaction';

export interface ITransactionGateway {
  create(transaction: Transaction): Promise<Transaction>;
}
