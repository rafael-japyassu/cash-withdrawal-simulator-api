
import { CreateUserUseCase } from '@/application/modules/user/use-cases/create-user/create-user-use-case';
import {
	HttpResponse,
	HttpController,
} from '@/infra/http/types/http-controller';
import { CreateUserDto } from './create-user.dto';

type CreateUserResponse = {
  id: string;
};

export class CreateUserController
implements HttpController<CreateUserDto, CreateUserResponse>
{
	constructor(private readonly createUserUseCase: CreateUserUseCase) {}

	async execute(body: CreateUserDto): Promise<HttpResponse<CreateUserResponse>> {
		const response = await this.createUserUseCase.execute(body);

		if (response.isLeft()) {
			const errors = response.getLeft();

			return {
				statusCode: 400,
				content: {
					data: null,
					errors: errors.getErrors().map((error) => error.message),
				}
			};
		}

		const user = response.getRight();

		return {
			statusCode: 201,
			content: {
				data: {
					id: user.id,
				},
				errors: [],
			}
		};
	}
}
