import { NotificationHandler } from '@/domain/validation/handler/notification-handler';
import { Either, Left, Right } from '@/utils/either';
import { WithdrawalMoneyUseCase } from './withdrawal-money-use-case';
import { ITransactionGateway } from '@/domain/modules/transaction/gateways/transaction-gateway';
import { IUserGateway } from '@/domain/modules/user/gateways/user-gateway';
import { UserID } from '@/domain/modules/user/user-id';
import { UserNotFoundException } from '@/application/modules/user/exceptions/user-not-found-exception';
import { Transaction } from '@/domain/modules/transaction/transaction';
import { WithdrawalMoneyCommand } from './withdrawal-money-command';
import {
	WithdrawalMoneyNote,
	WithdrawalMoneyOutput,
} from './withdrawal-money-output';
import { InvalidAmountBankWithdrawalException } from '../../exceptions/invalid-amount-bank-withdrawal-exception';

export class DefaultWithdrawalMoneyUseCase extends WithdrawalMoneyUseCase {
	private AVAILABLE_NOTES = [100, 50, 20, 10];

	constructor(
    private readonly transactionGateway: ITransactionGateway,
    private readonly userGateway: IUserGateway
	) {
		super();
	}

	async execute({
		userId,
		value,
	}: WithdrawalMoneyCommand): Promise<
    Either<NotificationHandler, WithdrawalMoneyOutput>
  > {
		const notification = NotificationHandler.create();
		if (value % 10 !== 0) {
			notification.append(new InvalidAmountBankWithdrawalException());

			return Left.create(notification);
		}

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

		const notesResult = this.withdrawMoneyNotes(value);

		return Right.create({
			transactionId: transaction.getId().getValue(),
			currentValue: newBalance,
			notes: notesResult,
		});
	}

	private withdrawMoneyNotes(value: number): WithdrawalMoneyNote[] {
		const withdrawalNotes: Record<number, number> = {};
		let initialValue = value;

		for (const note of this.AVAILABLE_NOTES) {
			if (initialValue >= note) {
				const notesQuantity = Math.floor(initialValue / note);
				withdrawalNotes[note] = notesQuantity;
				initialValue -= note * notesQuantity;
			}
		}

		const withdrawalResult = Object.keys(withdrawalNotes).map((note) => ({
			note,
			quantity: withdrawalNotes[Number(note)],
		}));

		return withdrawalResult;
	}
}
