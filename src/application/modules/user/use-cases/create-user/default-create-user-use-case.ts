import { User } from '@/domain/modules/user/user';
import { CreateUserCommand } from './create-user-command';
import { CreateUserOutput } from './create-user-output';
import { CreateUserUseCase } from './create-user-use-case';
import { NotificationHandler } from '@/domain/validation/handler/notification-handler';
import { Either, Left, Right } from '@/utils/either';
import { IUserGateway } from '@/domain/modules/user/gateways/user-gateway';
import { IHashGateway } from '@/domain/modules/hash/gateways/hash-gateway';
import { UserEmailAlreadyExistsException } from '../../exceptions/user-email-already-exists-exception';

export class DefaultCreateUserUseCase extends CreateUserUseCase {
	constructor(
    private readonly userGateway: IUserGateway,
    private readonly hashGateway: IHashGateway
	) {
		super();
	}

	async execute({
		name,
		email,
		password,
	}: CreateUserCommand): Promise<
    Either<NotificationHandler, CreateUserOutput>
  > {
		const notification = NotificationHandler.create();
		const userExists = await this.userGateway.findByEmail(email);

		if (userExists) {
			notification.append(new UserEmailAlreadyExistsException());

			return Left.create(notification);
		}

		const passwordHash = await this.hashGateway.hash(password);

		const user = User.create({
			name,
			email,
			password: passwordHash,
			balance: 10000,
		});
		user.validate(notification);

		if (notification.hasErrors()) {
			return Left.create(notification);
		}

		await this.userGateway.create(user);

		return Right.create({ id: user.getId().getValue() });
	}
}
