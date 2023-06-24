import { TransactionID } from '@/domain/modules/transaction/transaction-id';
import { randomUUID } from 'crypto';
import { describe, expect, it } from 'vitest';

describe('TransactionID', () => {
	it('should be able to create a valid user-id', () => {
		const transactionID = TransactionID.generate();

		expect(typeof transactionID.getValue() === 'string').toBe(true);
	});

	it('should be able to create a valid user-id by string', () => {
		const id = randomUUID();
		const transactionID = TransactionID.from(id);

		expect(transactionID.getValue()).toEqual(id);
	});
});
