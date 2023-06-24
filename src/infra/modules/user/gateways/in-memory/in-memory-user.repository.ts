import { IUserGateway } from '@/domain/modules/user/gateways/user-gateway';
import { User } from '@/domain/modules/user/user';
import { UserID } from '@/domain/modules/user/user-id';

export class InMemoryUserRepository implements IUserGateway {
	private users: User[];

	constructor() {
		this.users = [];
	}

	async findById(userId: UserID): Promise<User | undefined> {
		return this.users.find(
			(user) => user.getId().getValue() === userId.getValue()
		);
	}

	async findByEmail(email: string): Promise<User | undefined> {
		return this.users.find((user) => user.getEmail() === email);
	}

	async create(user: User): Promise<User> {
		this.users.push(user);

		return user;
	}

	async update(user: User): Promise<User> {
		const userIndex = this.users.findIndex(
			(user) => user.getId().getValue() === user.getId().getValue()
		);

		this.users[userIndex] = user;
		return user;
	}
}
