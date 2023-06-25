import { HttpMethod, HttpRouter, HttpRouterData } from '@/infra/http/types/http-router';
import { transactionInjections } from '../../injections';
import { WithdrawalMoneyController } from '../controllers/withdrawal-money/withdrawal-money.controller';
import { WithdrawalMoneyDto, withdrawalMoneySchema } from '../controllers/withdrawal-money/withdrawal-money.dto';

export class TransactionRoutes extends HttpRouter {
	private readonly VERSION_1 = '/v1';
	private readonly RESOURCE = '/transactions/withdrawal';
	private readonly routes: HttpRouterData[];

	private readonly withdrawalMoneyController: WithdrawalMoneyController;

	constructor() {
		super();
		console.log(`Load routes of "${TransactionRoutes.name}"`);
		this.routes = [];

		const { withdrawalMoneyUseCase } = transactionInjections();

		this.withdrawalMoneyController = new WithdrawalMoneyController(withdrawalMoneyUseCase);
	}

	getRoutes(): HttpRouterData[] {
		this.withdrawalMoney();

		return this.routes;
	}

	private withdrawalMoney(): void {
		const path = `${this.VERSION_1}${this.RESOURCE}`;

		const route: HttpRouterData = {
			method: HttpMethod.POST,
			path,
			useAuthenticate: true,
			handler: async (request) => {
				const payload = withdrawalMoneySchema.parse(request.body);
				const withdrawalMoneyPayload: WithdrawalMoneyDto = {
					...payload,
					userId: request.user.id
				};
				const result = await this.withdrawalMoneyController.execute(withdrawalMoneyPayload);

				return result;
			},
		};

		this.routes.push(route);
	}

}
