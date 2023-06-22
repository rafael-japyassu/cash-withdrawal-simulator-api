import { IUserGateway } from '@/domain/modules/user/gateways/user-gateway';
import { User } from '@/domain/modules/user/user';

export class InMemoryUserRepository implements IUserGateway {
	private users: User[];

	constructor() {
		this.users = [];
	}

	async findByEmail(email: string): Promise<User | undefined> {
		return this.users.find(user => user.getEmail() === email);
	}

	async create(user: User): Promise<User> {
		this.users.push(user);

		return user;
	}

  
}