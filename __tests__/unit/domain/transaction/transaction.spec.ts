import { Transaction } from '@/domain/modules/transaction/transaction';
import { CreateTransactionAggregate } from '@/domain/modules/transaction/type/create-transaction';
import { UserID } from '@/domain/modules/user/user-id';
import { NotificationHandler } from '@/domain/validation/handler/notification-handler';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('Transaction', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should be able to create a valid transaction', () => {
		const now = new Date(2023, 5, 24);
		vi.setSystemTime(now);

		const input: CreateTransactionAggregate = {
			userId: UserID.generate(),
			title: 'Saque',
			type: 'expense',
			value: 100
		};

		const transaction = Transaction.create(input);
		const notificationHandler = NotificationHandler.create();
		transaction.validate(notificationHandler);

		expect(notificationHandler.hasErrors()).toBe(false);
		expect(transaction).toHaveProperty('id');
		expect(transaction).toHaveProperty('createdAt');
		expect(transaction).toHaveProperty('updatedAt');
		expect(transaction.getTitle()).toEqual('Saque');
		expect(transaction.getType()).toEqual('expense');
		expect(transaction.getValue()).toEqual(100);
		expect(transaction.getCreatedAt()).toEqual(now);
		expect(transaction.getUpdatedAt()).toEqual(now);
	});

	it('should be able to create a transaction with invalid title', () => {
		const now = new Date(2023, 5, 24);
		vi.setSystemTime(now);

		const input: CreateTransactionAggregate = {
			userId: UserID.generate(),
			title: '',
			type: 'expense',
			value: 100
		};

		const transaction = Transaction.create(input);
		const notificationHandler = NotificationHandler.create();
		transaction.validate(notificationHandler);

		const expectedError = '"title" should not be empty';

		const errorMessages = notificationHandler
			.getErrors()
			.map((error) => error.message);
  
		expect(notificationHandler.hasErrors()).toBe(true);
		expect(errorMessages).toEqual(expect.arrayContaining([expectedError]));
	});
	
	it('should be able to create a transaction with invalid user', () => {
		const now = new Date(2023, 5, 24);
		vi.setSystemTime(now);

		const input = {
			userId: null,
			title: 'Saque',
			type: 'expense',
			value: 100
		} as unknown as CreateTransactionAggregate;

		const transaction = Transaction.create(input);
		const notificationHandler = NotificationHandler.create();
		transaction.validate(notificationHandler);

		const expectedError = '"userId" should not be null';

		const errorMessages = notificationHandler
			.getErrors()
			.map((error) => error.message);
  
		expect(notificationHandler.hasErrors()).toBe(true);
		expect(errorMessages).toEqual(expect.arrayContaining([expectedError]));
	});
	
	it('should be able to create a transaction with invalid type', () => {
		const now = new Date(2023, 5, 24);
		vi.setSystemTime(now);

		const input = {
			userId: UserID.generate(),
			title: 'Saque',
			type: '',
			value: 100
		} as unknown as CreateTransactionAggregate;

		const transaction = Transaction.create(input);
		const notificationHandler = NotificationHandler.create();
		transaction.validate(notificationHandler);

		const expectedError = '"type" should not be empty';

		const errorMessages = notificationHandler
			.getErrors()
			.map((error) => error.message);
  
		expect(notificationHandler.hasErrors()).toBe(true);
		expect(errorMessages).toEqual(expect.arrayContaining([expectedError]));
	});
	
	it('should be able to create a transaction with invalid value', () => {
		const now = new Date(2023, 5, 24);
		vi.setSystemTime(now);

		const input = {
			userId: UserID.generate(),
			title: 'Saque',
			type: 'expense',
			value: null
		} as unknown as CreateTransactionAggregate;

		const transaction = Transaction.create(input);
		const notificationHandler = NotificationHandler.create();
		transaction.validate(notificationHandler);

		const expectedError = '"value" should not be null';

		const errorMessages = notificationHandler
			.getErrors()
			.map((error) => error.message);
  
		expect(notificationHandler.hasErrors()).toBe(true);
		expect(errorMessages).toEqual(expect.arrayContaining([expectedError]));
	});
	
	it('should be able to create a transaction with value less than 0', () => {
		const now = new Date(2023, 5, 24);
		vi.setSystemTime(now);

		const input: CreateTransactionAggregate = {
			userId: UserID.generate(),
			title: 'Saque',
			type: 'expense',
			value: -3100
		};

		const transaction = Transaction.create(input);
		const notificationHandler = NotificationHandler.create();
		transaction.validate(notificationHandler);

		const expectedError = '"value" cannot be less than 0';

		const errorMessages = notificationHandler
			.getErrors()
			.map((error) => error.message);
  
		expect(notificationHandler.hasErrors()).toBe(true);
		expect(errorMessages).toEqual(expect.arrayContaining([expectedError]));
	});
});
