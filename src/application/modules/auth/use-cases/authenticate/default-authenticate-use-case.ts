import { NotificationHandler } from '@/domain/validation/handler/notification-handler';
import { Either, Left, Right } from '@/utils/either';
import { AuthenticateCommand } from './authenticate-command';
import { AuthenticateOutput } from './authenticate-output';
import { AuthenticateUseCase } from './authenticate-use-case';
import { IUserGateway } from '@/domain/modules/user/gateways/user-gateway';
import { IAuthGateway } from '@/domain/modules/auth/gateways/auth-gateway';
import { IHashGateway } from '@/domain/modules/hash/gateways/hash-gateway';

export class DefaultAuthenticateUseCase extends AuthenticateUseCase {
	constructor(
    private readonly userGateway: IUserGateway,
    private readonly hashGateway: IHashGateway,
    private readonly authGateway: IAuthGateway
	) {
		super();
	}

	async execute({
		email,
		password,
	}: AuthenticateCommand): Promise<
    Either<NotificationHandler, AuthenticateOutput>
  > {
		const notification = NotificationHandler.create();
		const user = await this.userGateway.findByEmail(email);

		if (!user) {
			notification.append(new Error('User email or password incorrect'));

			return Left.create(notification);
		}

		const matchPassword = await this.hashGateway.compare(password, user.getPassword());

		if (!matchPassword) {
			notification.append(new Error('User email or password incorrect'));

			return Left.create(notification);
		}

		const secret = String(process.env.JWT_SECRET);
		const expiresIn = new Date();
		expiresIn.setDate(expiresIn.getDate() + 1);
		
		const token = await this.authGateway.generateJwt({
			secret,
			object: { id: user.getId().getValue() },
			expiresIn: expiresIn.getTime(),
		});

		return Right.create({
			token,
			user: {
				name: user.getName(),
				email: user.getEmail()
			}
		});
	}
}
