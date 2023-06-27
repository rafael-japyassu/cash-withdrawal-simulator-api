import { NotificationHandler } from '@/domain/validation/handler/notification-handler';
import { Either, Right } from '@/utils/either';
import { FindAllTransactionsCommand } from './find-all-transactions-command';
import { FindAllTransactionsOutput } from './find-all-transactions-output';
import { FindAllTransactionsUseCase } from './find-all-transactions-use-case';
import { ITransactionGateway } from '@/domain/modules/transaction/gateways/transaction-gateway';
import { UserID } from '@/domain/modules/user/user-id';

export class DefaultFindAllTransactionsUseCase extends FindAllTransactionsUseCase {
	constructor(private readonly transactionGateway: ITransactionGateway) {
		super();
	}

	async execute(
		{ page = 1, userId, size = 20 }: FindAllTransactionsCommand
	): Promise<Either<NotificationHandler, FindAllTransactionsOutput>> {
		const pageFormat = page === 0 ? 1 : Number(page);
		const sizeFormat = Number(size);
    
		const pageData = (pageFormat - 1) * sizeFormat;
		const { count, transactions } = await this.transactionGateway.findAllPaginated({
			page: pageData,
			size: sizeFormat,
			userId: UserID.from(userId)
		});

		const totalPages = Math.ceil(count / sizeFormat);

		return Right.create({
			content: transactions.map(transaction => ({
				id: transaction.getId().getValue(),
				title: transaction.getTitle(),
				type: transaction.getType(),
				value: transaction.getValue(),
				createdAt: transaction.getCreatedAt(),
			})),
			totalPages,
			elementsInPage: transactions.length,
			firstPage: pageFormat === 1,
			lastPage: totalPages === 0 ? true : pageFormat === totalPages,
			page: pageFormat,
			size: sizeFormat,
			totalElements: count
		});

	}
}
