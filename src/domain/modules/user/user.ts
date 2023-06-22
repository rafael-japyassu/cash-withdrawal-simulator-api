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
    private createdAt: Date,
    private updatedAt: Date
	) {
		super(id);
	}

	static create({ name, email, password }: CreateUserAggregate): User {
		const id = UserID.generate();
		const now = new Date();

		return new User(id, name, email, password, now, now);
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

	public getCreatedAt(): Date {
		return this.createdAt;
	}

	public getUpdatedAt(): Date {
		return this.updatedAt;
	}
  
}