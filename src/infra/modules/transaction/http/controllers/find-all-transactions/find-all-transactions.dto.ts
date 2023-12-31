import { TransactionType } from '@/domain/modules/transaction/type/transaction-type';
import { z } from 'zod';

export const findAllTransactionsSchema = z.object({
	page: z.string().optional().refine(page => Number(page)),
	size: z.string().optional().refine(size => Number(size)),
});

export type FindAllTransactionsDto = z.infer<typeof findAllTransactionsSchema> & {
  userId: string;
};

type TransactionOutput = {
  id: string;
  type: TransactionType;
  value: number;
  createdAt: Date;
}

export type FindAllTransactionsResponseDto = {
  content: TransactionOutput[];
  elementsInPage: number;
  totalPages: number;
  totalElements: number;
  firstPage: boolean;
  lastPage: boolean;
  page: number;
  size: number;
}