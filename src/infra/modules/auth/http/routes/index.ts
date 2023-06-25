import {
	HttpMethod,
	HttpRouter,
	HttpRouterData,
} from '@/infra/http/types/http-router';

import { AuthenticateController } from '../controllers/authenticate/authenticate.controller';
import { authenticateInjections } from '../../injections';
import { authenticateSchema } from '../controllers/authenticate/authenticate.dto';

export class AuthenticateRoutes extends HttpRouter {
	private readonly VERSION_1 = '/v1';
	private readonly RESOURCE = '/auth';
	private readonly routes: HttpRouterData[];

	private readonly authenticateController: AuthenticateController;

	constructor() {
		super();
		this.routes = [];
		console.log(`Load routes of "${AuthenticateRoutes.name}"`);

		const { authenticateUseCase } = authenticateInjections();

		this.authenticateController = new AuthenticateController(
			authenticateUseCase
		);
	}

	getRoutes() {
		this.authUser();

		return this.routes;
	}

	private authUser(): void {
		const path = `${this.VERSION_1}${this.RESOURCE}`;

		const route: HttpRouterData = {
			method: HttpMethod.POST,
			path,
			handler: async (request) => {
				const payload = authenticateSchema.parse(request.body);
				const result = await this.authenticateController.execute(payload);

				return result;
			},
		};

		this.routes.push(route);
	}
}
