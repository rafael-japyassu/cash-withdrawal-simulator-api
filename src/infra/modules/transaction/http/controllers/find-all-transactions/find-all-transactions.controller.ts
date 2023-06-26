import {
	HttpResponse,
	HttpController,
} from '@/infra/http/types/http-controller';
import { FindAllTransactionsUseCase } from '@/application/modules/transaction/use-cases/find-all-transactions/find-all-transactions-use-case';
import { FindAllTransactionsDto, FindAllTransactionsResponseDto } from './find-all-transactions.dto';

export class FindAllTransactionsController
implements HttpController<FindAllTransactionsDto, FindAllTransactionsResponseDto>
{
	constructor(
    private readonly findAllTransactionsUseCase: FindAllTransactionsUseCase
	) {}

	async execute(
		params: FindAllTransactionsDto
	): Promise<HttpResponse<FindAllTransactionsResponseDto>> {
		const response = await this.findAllTransactionsUseCase.execute(params);

		if (response.isLeft()) {
			const errors = response.getLeft();

			return {
				statusCode: 400,
				content: {
					data: null,
					errors: errors.getErrors().map((error) => error.message),
				},
			};
		}

		const data = response.getRight();

		return {
			statusCode: 200,
			content: {
				data: data,
				errors: [],
			},
		};
	}
}
