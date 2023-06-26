import { TransactionType } from '@/domain/modules/transaction/type/transaction-type';

type TransactionOutput = {
  id: string;
  type: TransactionType;
  value: number;
  createdAt: Date;
}

export type FindAllTransactionsOutput = {
  content: TransactionOutput[];
  elementsInPage: number;
  totalPages: number;
  totalElements: number;
  firstPage: boolean;
  lastPage: boolean;
  page: number;
  size: number;
}