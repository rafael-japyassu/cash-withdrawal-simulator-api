import { HttpMethod, HttpRouter, HttpRouterData } from '@/infra/http/types/http-router';
import { userInjections } from '../../injections';
import { createUserSchema } from '../controllers/crate-user/create-user.dto';
import { CreateUserController } from '../controllers/crate-user/create-user.controller';

export class UserRoutes extends HttpRouter {
	private readonly VERSION_1 = '/v1';
	private readonly RESOURCE = '/users';
	private readonly routes: HttpRouterData[];

	private readonly createUserController: CreateUserController;

	constructor() {
		super();
		console.log(`Load routes of "${UserRoutes.name}"`);
		this.routes = [];

		const { createUserUseCase } = userInjections();

		this.createUserController = new CreateUserController(createUserUseCase);
	}

	getRoutes(): HttpRouterData[] {
		this.createUser();

		return this.routes;
	}

	private createUser(): void {
		const path = `${this.VERSION_1}${this.RESOURCE}`;

		const route: HttpRouterData = {
			method: HttpMethod.POST,
			path,
			handler: async (request) => {
				const payload = createUserSchema.parse(request.body);
				const result = await this.createUserController.execute(payload);

				return result;
			},
		};

		this.routes.push(route);
	}

}
