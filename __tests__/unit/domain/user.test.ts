import { CreateUserAggregate } from '@/domain/modules/user/types/create-user';
import { User } from '@/domain/modules/user/user';
import { NotificationHandler } from '@/domain/validation/handler/notification-handler';
import { describe, expect, it } from 'vitest';

describe('User', () => {
	it('should be able to create a valid user', () => {
		const input: CreateUserAggregate = {
			name: 'John Doe',
			email: 'johdoe@email.com',
			password: '123123',
		};

		const user = User.create(input);
		const notificationHandler = NotificationHandler.create();
		user.validate(notificationHandler);

		expect(notificationHandler.hasErrors()).toBe(false);
		expect(user).toHaveProperty('id');
		expect(user).toHaveProperty('createdAt');
		expect(user).toHaveProperty('updatedAt');
		expect(user).toEqual(expect.objectContaining(input));
	});

	describe('Property - Name', () => {
		it('should not be able to create a user with a empty name', () => {
			const input: CreateUserAggregate = {
				name: '',
				email: 'johdoe@email.com',
				password: '123123',
			};
			const expectedError = '"name" should not be empty';
  
			const user = User.create(input);
			const notificationHandler = NotificationHandler.create();
			user.validate(notificationHandler);
  
			const errorMessages = notificationHandler
				.getErrors()
				.map((error) => error.message);
  
			expect(notificationHandler.hasErrors()).toBe(true);
			expect(errorMessages).toEqual(expect.arrayContaining([expectedError]));
		});
  
		it('should not be able to create a user with a null name', () => {
			const input = {
				name: null,
				email: 'johdoe@email.com',
				password: '123123',
			} as unknown as CreateUserAggregate;
			const expectedError = '"name" should not be null';
  
			const user = User.create(input);
			const notificationHandler = NotificationHandler.create();
			user.validate(notificationHandler);
  
			const errorMessages = notificationHandler
				.getErrors()
				.map((error) => error.message);
  
			expect(notificationHandler.hasErrors()).toBe(true);
			expect(errorMessages).toEqual(expect.arrayContaining([expectedError]));
		});
  
		it('should not be able to create a user with a invalid name length', () => {
			const input: CreateUserAggregate = {
				name: 'Jo',
				email: 'johdoe@email.com',
				password: '123123',
			};
			const expectedError = '"name" must be between 3 and 255 characters';
  
			const user = User.create(input);
			const notificationHandler = NotificationHandler.create();
			user.validate(notificationHandler);
  
			const errorMessages = notificationHandler
				.getErrors()
				.map((error) => error.message);
  
			expect(notificationHandler.hasErrors()).toBe(true);
			expect(errorMessages).toEqual(expect.arrayContaining([expectedError]));
		});
	});

	describe('Property - Email', () => {
		it('should not be able to create a user with a invalid email', () => {
			const input: CreateUserAggregate = {
				name: 'John Dow',
				email: 'john.doe@email',
				password: '123123',
			};
			const expectedError = '"email" has invalid';
  
			const user = User.create(input);
			const notificationHandler = NotificationHandler.create();
			user.validate(notificationHandler);
  
			const errorMessages = notificationHandler
				.getErrors()
				.map((error) => error.message);
  
			expect(notificationHandler.hasErrors()).toBe(true);
			expect(errorMessages).toEqual(expect.arrayContaining([expectedError]));
		});
		
		it('should not be able to create a user with a empty email', () => {
			const input: CreateUserAggregate = {
				name: 'John Dow',
				email: '',
				password: '123123',
			};
			const expectedError = '"email" should not be empty';
  
			const user = User.create(input);
			const notificationHandler = NotificationHandler.create();
			user.validate(notificationHandler);
  
			const errorMessages = notificationHandler
				.getErrors()
				.map((error) => error.message);
  
			expect(notificationHandler.hasErrors()).toBe(true);
			expect(errorMessages).toEqual(expect.arrayContaining([expectedError]));
		});
  
		it('should not be able to create a user with a null email', () => {
			const input = {
				name: 'John Dow',
				email: null,
				password: '123123',
			} as unknown as CreateUserAggregate;
			const expectedError = '"email" should not be null';
  
			const user = User.create(input);
			const notificationHandler = NotificationHandler.create();
			user.validate(notificationHandler);
  
			const errorMessages = notificationHandler
				.getErrors()
				.map((error) => error.message);
  
			expect(notificationHandler.hasErrors()).toBe(true);
			expect(errorMessages).toEqual(expect.arrayContaining([expectedError]));
		});
	});

	describe('Property - Password', () => {
		it('should not be able to create a user with a empty password', () => {
			const input: CreateUserAggregate = {
				name: 'John Doe',
				email: 'johdoe@email.com',
				password: '',
			};
			const expectedError = '"password" should not be empty';
  
			const user = User.create(input);
			const notificationHandler = NotificationHandler.create();
			user.validate(notificationHandler);
  
			const errorMessages = notificationHandler
				.getErrors()
				.map((error) => error.message);
  
			expect(notificationHandler.hasErrors()).toBe(true);
			expect(errorMessages).toEqual(expect.arrayContaining([expectedError]));
		});
  
		it('should not be able to create a user with a null password', () => {
			const input = {
				name: 'John Doe',
				email: 'johdoe@email.com',
				password: null,
			} as unknown as CreateUserAggregate;
			const expectedError = '"password" should not be null';
  
			const user = User.create(input);
			const notificationHandler = NotificationHandler.create();
			user.validate(notificationHandler);
  
			const errorMessages = notificationHandler
				.getErrors()
				.map((error) => error.message);
  
			expect(notificationHandler.hasErrors()).toBe(true);
			expect(errorMessages).toEqual(expect.arrayContaining([expectedError]));
		});
  
		it('should not be able to create a user with a invalid password length', () => {
			const input: CreateUserAggregate = {
				name: 'John Doe',
				email: 'johdoe@email.com',
				password: '123',
			};
			const expectedError = '"password" must be between 5 and 255 characters';
  
			const user = User.create(input);
			const notificationHandler = NotificationHandler.create();
			user.validate(notificationHandler);
  
			const errorMessages = notificationHandler
				.getErrors()
				.map((error) => error.message);
  
			expect(notificationHandler.hasErrors()).toBe(true);
			expect(errorMessages).toEqual(expect.arrayContaining([expectedError]));
		});
	});
});
