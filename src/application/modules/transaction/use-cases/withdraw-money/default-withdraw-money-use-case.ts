import { NotificationHandler } from '@/domain/validation/handler/notification-handler';
import { Either, Left, Right } from '@/utils/either';
import { WithdrawMoneyCommand } from './withdraw-money-command';
import { WithdrawMoneyOutput } from './withdraw-money-output';
import { WithdrawMoneyUseCase } from './withdraw-money-use-case';
import { ITransactionGateway } from '@/domain/modules/transaction/gateways/transaction-gateway';
import { IUserGateway } from '@/domain/modules/user/gateways/user-gateway';
import { UserID } from '@/domain/modules/user/user-id';
import { UserNotFoundException } from '@/application/modules/user/exceptions/user-not-found-exception';
import { Transaction } from '@/domain/modules/transaction/transaction';

export class DefaultWithdrawMoneyUseCase extends WithdrawMoneyUseCase {
	constructor(
    private readonly transactionGateway: ITransactionGateway,
    private readonly userGateway: IUserGateway
	) {
		super();
	}

	async execute({
		userId,
		value,
	}: WithdrawMoneyCommand): Promise<
    Either<NotificationHandler, WithdrawMoneyOutput>
  > {
		const notification = NotificationHandler.create();
		const user = await this.userGateway.findById(UserID.from(userId));

		if (!user) {
			notification.append(new UserNotFoundException());

			return Left.create(notification);
		}

		const transaction = Transaction.create({
			userId: user.getId(),
			title: 'Saque',
			type: 'expense',
			value,
		});

		transaction.validate(notification);

		const newBalance = user.getBalance() - value;

		user.update({
			name: user.getName(),
			email: user.getEmail(),
			password: user.getPassword(),
			balance: newBalance,
		});

		user.validate(notification);

		if (notification.hasErrors()) {
			return Left.create(notification);
		}

		await Promise.all([
			this.transactionGateway.create(transaction),
			this.userGateway.update(user),
		]);

		return Right.create({
			transactionId: transaction.getId().getValue(),
			currentValue: newBalance,
		});
	}
}
