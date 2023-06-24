import { Validator } from '@/domain/validation/validator';
import { ValidationHandler } from '@/domain/validation/validation-handler';
import { Transaction } from '../transaction';

export class TransactionValidator extends Validator {
	private readonly MIN_VALUE = 0;

	constructor(private readonly transaction: Transaction, readonly handler: ValidationHandler) {
		super(handler);
	}

	validate(): void {
		this.validateUserID();
		this.validateTitle();
		this.validateType();
		this.validateValue();
	}
  
	private validateUserID() {
		const userId = this.transaction.getUserId();

		this.checkConstraintRequired('userId', userId?.getValue());
	}

	private validateTitle() {
		const title = this.transaction.getTitle();

		this.checkConstraintRequired('title', title);
	}
	
	private validateType() {
		const type = this.transaction.getType();

		this.checkConstraintRequired('type', type);
	}

	private validateValue() {
		const value = this.transaction.getValue();

		this.checkConstraintRequired('value', value);

		if (value < this.MIN_VALUE) {
			this.handler.append(new Error(`"value" cannot be less than ${this.MIN_VALUE}`));
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
}
