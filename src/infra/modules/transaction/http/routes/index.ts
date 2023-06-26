import { HttpMethod, HttpRouter, HttpRouterData } from '@/infra/http/types/http-router';
import { transactionInjections } from '../../injections';
import { WithdrawalMoneyController } from '../controllers/withdrawal-money/withdrawal-money.controller';
import { WithdrawalMoneyDto, withdrawalMoneySchema } from '../controllers/withdrawal-money/withdrawal-money.dto';
import { FindAllTransactionsDto, findAllTransactionsSchema } from '../controllers/find-all-transactions/find-all-transactions.dto';
import { FindAllTransactionsController } from '../controllers/find-all-transactions/find-all-transactions.controller';

export class TransactionRoutes extends HttpRouter {
	private readonly VERSION_1 = '/v1';
	private readonly RESOURCE = '/transactions';
	private readonly routes: HttpRouterData[];

	private readonly withdrawalMoneyController: WithdrawalMoneyController;
	private readonly findAllTransactionsController: FindAllTransactionsController;

	constructor() {
		super();
		console.log(`Load routes of "${TransactionRoutes.name}"`);
		this.routes = [];

		const { withdrawalMoneyUseCase, findAllTransactionsUseCase } = transactionInjections();

		this.withdrawalMoneyController = new WithdrawalMoneyController(withdrawalMoneyUseCase);
		this.findAllTransactionsController = new FindAllTransactionsController(findAllTransactionsUseCase);
	}

	getRoutes(): HttpRouterData[] {
		this.withdrawalMoney();
		this.findAllTransactions();

		return this.routes;
	}

	private withdrawalMoney(): void {
		const path = `${this.VERSION_1}${this.RESOURCE}/withdrawal-money`;

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
	
	private findAllTransactions(): void {
		const path = `${this.VERSION_1}${this.RESOURCE}`;

		const route: HttpRouterData = {
			method: HttpMethod.GET,
			path,
			useAuthenticate: true,
			handler: async (request) => {
				const queryParams = findAllTransactionsSchema.parse(request.query);
				const findAllTransactionParams: FindAllTransactionsDto = {
					...queryParams,
					userId: request.user.id
				};
				const result = await this.findAllTransactionsController.execute(findAllTransactionParams);

				return result;
			},
		};

		this.routes.push(route);
	}

}
