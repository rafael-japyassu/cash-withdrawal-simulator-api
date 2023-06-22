import { Validator } from '@/domain/validation/validator';
import { User } from '../user';
import { ValidationHandler } from '@/domain/validation/validation-handler';

export class UserValidator extends Validator {
	private readonly NAME_MIN_LENGTH = 3;
	private readonly NAME_MAX_LENGTH = 255;

	private readonly PASSWORD_MIN_LENGTH = 5;
	private readonly PASSWORD_MAX_LENGTH = 255;

	private readonly BALANCE_MIN_VALUE = 0;

	constructor(private readonly user: User, readonly handler: ValidationHandler) {
		super(handler);
	}

	validate(): void {
		this.validateName();
		this.validateEmail();
		this.validatePassword();
		this.validateBalance();
	}
  
	private validateName() {
		const name = this.user.getName();

		this.checkConstraintRequired('name', name);
		this.checkConstraintLength('name', name, this.NAME_MIN_LENGTH, this.NAME_MAX_LENGTH);
	}
	
	private validateEmail() {
		const email = this.user.getEmail();
		const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		this.checkConstraintRequired('email', email);

		if (!regexEmail.test(email)) {
			this.handler.append(new Error('"email" has invalid'));
		}
	}

	private validatePassword() {
		const password = this.user.getPassword();

		this.checkConstraintRequired('password', password);
		this.checkConstraintLength('password', password, this.PASSWORD_MIN_LENGTH, this.PASSWORD_MAX_LENGTH);
	}

	private validateBalance() {
		const balance = this.user.getBalance();

		this.checkConstraintRequired('balance', balance);

		if (balance < this.BALANCE_MIN_VALUE) {
			this.handler.append(new Error(`"balance" cannot be less than ${this.BALANCE_MIN_VALUE}`));
		}
	}

	private checkConstraintRequired(field: string, constraint: string | number) {
		if (!constraint || constraint === null) {
			this.handler.append(new Error(`"${field}" should not be null`));
		}

		if (typeof constraint === 'string' && !constraint?.trim()) {
			this.handler.append(new Error(`"${field}" should not be empty`));
		}
	}
	
	private checkConstraintLength(field: string, constraint: string, min: number, max: number) {
		if (constraint?.length < min || constraint?.length > max) {
			this.handler.append(new Error(`"${field}" must be between ${min} and ${max} characters`));
		}
	}
}
