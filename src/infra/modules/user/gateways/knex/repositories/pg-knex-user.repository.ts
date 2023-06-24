import { IUserGateway } from '@/domain/modules/user/gateways/user-gateway';
import { User } from '@/domain/modules/user/user';
import { UserID } from '@/domain/modules/user/user-id';
import { knexConnection } from '@/infra/config/database/knex';
import { Knex } from 'knex';

const USER_TABLE = 'users';
interface UserKnex {
  id: string;
  name: string;
  email: string;
  password: string;
  balance: number;
  created_at: Date;
  updated_at: Date;
}

export class PgKnexUserRepository implements IUserGateway {
	private userRepository: Knex.QueryBuilder;

	constructor() {
		this.userRepository = knexConnection<UserKnex>(USER_TABLE);
	}

	async findByEmail(email: string): Promise<User | undefined> {
		const users = await this.userRepository.where({ email });

		if (!users.length) {
			return undefined;
		}

		return this.entityToAggregate(users[0]);
	}

	async findById(userId: UserID): Promise<User | undefined> {
		const users = await this.userRepository.where({ id: userId.getValue() });

		if (!users.length) {
			return undefined;
		}

		return this.entityToAggregate(users[0]);
	}

	async create(user: User): Promise<User> {
		await this.userRepository.insert(this.aggregateToEntity(user));

		return user;
	}

	async update(user: User): Promise<User> {
		await this.userRepository
			.where({ id: user.getId().getValue() })
			.update(this.aggregateToEntity(user));

		return user;
	}

	private entityToAggregate({
		balance,
		created_at,
		email,
		id,
		name,
		password,
		updated_at,
	}: UserKnex): User {
		return User.toAggregate({
			id,
			name,
			email,
			password,
			balance,
			createdAt: created_at,
			updatedAt: updated_at,
		});
	}

	private aggregateToEntity(user: User): UserKnex {
		return {
			id: user.getId().getValue(),
			name: user.getName(),
			email: user.getEmail(),
			password: user.getPassword(),
			balance: user.getBalance(),
			created_at: user.getCreatedAt(),
			updated_at: user.getUpdatedAt(),
		};
	}
}
