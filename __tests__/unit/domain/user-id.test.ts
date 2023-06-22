import { UserID } from '@/domain/modules/user/user-id';
import { randomUUID } from 'crypto';
import { describe, expect, it } from 'vitest';

describe('UserID', () => {
	it('should be able to create a valid user-id', () => {
		const userId = UserID.generate();

		expect(typeof userId.getValue() === 'string').toBe(true);
	});

	it('should be able to create a valid user-id by string', () => {
		const id = randomUUID();
		const userId = UserID.from(id);

		expect(userId.getValue()).toEqual(id);
	});
});
