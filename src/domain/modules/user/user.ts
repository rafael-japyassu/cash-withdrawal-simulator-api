import { AggregateRoot } from '@/domain/@core/aggregate-root';
import { UserID } from './user-id';
import { ValidationHandler } from '@/domain/validation/validation-handler';

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

	validate(_: ValidationHandler): void {
		return;
	}
  
}