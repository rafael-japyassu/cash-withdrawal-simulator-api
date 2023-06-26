import { UserID } from '../../user/user-id';
import { Transaction } from '../transaction';

export type FindAllTransactionPaginatedParams = {
  page: number;
  size: number;
  userId?: UserID;
};

export type FindAllTransactionPaginatedResponse = {
  transactions: Transaction[];
  count: number;
};
