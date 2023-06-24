import { UserID } from '../../user/user-id';
import { TransactionType } from './transaction-type';

export type CreateTransactionAggregate = {
  userId: UserID;
  title: string;
  type: TransactionType;
  value: number;
};
