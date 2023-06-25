import { WithdrawalMoneyNote } from '@/application/modules/transaction/use-cases/withdrawal-money/withdrawal-money-output';
import { z } from 'zod';

export const withdrawalMoneySchema = z.object({
	value: z.number()
});

export type WithdrawalMoneyDto = z.infer<typeof withdrawalMoneySchema> & {
  userId: string;
};

export type WithdrawalMoneyResponseDto = {
  transactionId: string;
  currentValue: number;
  notes: WithdrawalMoneyNote[];
}