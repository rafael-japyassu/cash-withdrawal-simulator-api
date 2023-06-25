import {
	HttpResponse,
	HttpController,
} from '@/infra/http/types/http-controller';
import {
	WithdrawalMoneyDto,
	WithdrawalMoneyResponseDto,
} from './withdrawal-money.dto';
import { WithdrawalMoneyUseCase } from '@/application/modules/transaction/use-cases/withdrawal-money/withdrawal-money-use-case';

export class WithdrawalMoneyController
implements HttpController<WithdrawalMoneyDto, WithdrawalMoneyResponseDto>
{
	constructor(
    private readonly withdrawalMoneyUseCase: WithdrawalMoneyUseCase
	) {}

	async execute(
		body: WithdrawalMoneyDto
	): Promise<HttpResponse<WithdrawalMoneyResponseDto>> {
		const response = await this.withdrawalMoneyUseCase.execute(body);

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
			statusCode: 201,
			content: {
				data: data,
				errors: [],
			},
		};
	}
}
