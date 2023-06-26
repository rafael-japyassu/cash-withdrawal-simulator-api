import { AggregateRoot } from '@/domain/@core/aggregate-root';
import { ValidationHandler } from '@/domain/validation/validation-handler';
import { TransactionID } from './transaction-id';
import { CreateTransactionAggregate } from './type/create-transaction';
import { TransactionType } from './type/transaction-type';
import { TransactionValidator } from './validators/transaction-validator';
import { UserID } from '../user/user-id';
import { BuildTransactionAggregate } from './type/build-transaction';

export class Transaction extends AggregateRoot<TransactionID> {
	constructor(
    protected id: TransactionID,
    private userId: UserID,
    private title: string,
    private type: TransactionType,
    private value: number,
    private createdAt: Date,
    private updatedAt: Date,
	) {
		super(id);
	}

	static create({ userId, title, type, value }: CreateTransactionAggregate): Transaction {
		const id = TransactionID.generate();
		const now = new Date();

		return new Transaction(id, userId, title, type, value, now, now);
	}

	public static toAggregate({
		title,
		type,
		userId,
		value,
		createdAt,
		id,
		updatedAt,
	}: BuildTransactionAggregate): Transaction {
		const transactionId = TransactionID.from(id);

		return new Transaction(
			transactionId,
			UserID.from(userId),
			title,
			type,
			value,
			createdAt,
			updatedAt
		);
	}

	validate(handler: ValidationHandler): void {
		new TransactionValidator(this, handler).validate();
		return;
	}

	public getUserId(): UserID {
		return this.userId;
	}

	public getTitle(): string {
		return this.title;
	}

	public getType(): TransactionType {
		return this.type;
	}

	public getValue(): number {
		return this.value;
	}

	public getCreatedAt(): Date {
		return this.createdAt;
	}
	
	public getUpdatedAt(): Date {
		return this.updatedAt;
	}
  
}