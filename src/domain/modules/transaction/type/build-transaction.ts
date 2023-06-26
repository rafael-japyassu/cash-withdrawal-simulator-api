import { TransactionType } from './transaction-type';

export type BuildTransactionAggregate = {
  id: string;
  userId: string
  title: string;
  type: TransactionType;
  value: number;
  createdAt: Date;
  updatedAt: Date;
};
