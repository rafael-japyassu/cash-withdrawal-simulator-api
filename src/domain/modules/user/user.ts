import { AggregateRoot } from '@/domain/@core/aggregate-root';
import { UserID } from './user-id';
import { ValidationHandler } from '@/domain/validation/validation-handler';
import { CreateUserAggregate } from './types/create-user';
import { UserValidator } from './validators/user-validator';

export class User extends AggregateRoot<UserID> {
	constructor(
    protected id: UserID,
    private name: string,
    private email: string,
    private password: string,
    private balance: number,
    private createdAt: Date,
    private updatedAt: Date
	) {
		super(id);
	}

	public static create({ name, email, password, balance }: CreateUserAggregate): User {
		const id = UserID.generate();
		const now = new Date();

		return new User(id, name, email, password, balance, now, now);
	}

	public update({ balance, email, name, password }: CreateUserAggregate): User {
		this.name = name;
		this.email = email;
		this.balance = balance;
		this.password = password;
		this.updatedAt = new Date();

		return this;
	}

	validate(handler: ValidationHandler): void {
		new UserValidator(this, handler).validate();
	}

	public getName(): string {
		return this.name;
	}

	public getEmail(): string {
		return this.email;
	}

	public getPassword(): string {
		return this.password;
	}
	
	public getBalance(): number {
		return this.balance;
	}

	public getCreatedAt(): Date {
		return this.createdAt;
	}

	public getUpdatedAt(): Date {
		return this.updatedAt;
	}
  
}