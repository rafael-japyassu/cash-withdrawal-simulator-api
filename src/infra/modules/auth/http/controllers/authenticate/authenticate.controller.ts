import { HttpController, HttpResponse } from '@/infra/http/types/http-controller';
import { AuthenticateDto, AuthenticateResponseDto } from './authenticate.dto';
import { AuthenticateUseCase } from '@/application/modules/auth/use-cases/authenticate/authenticate-use-case';

export class AuthenticateController extends HttpController<AuthenticateDto, AuthenticateResponseDto> {
	constructor(private readonly authenticateUseCase: AuthenticateUseCase) {
		super();
	}

	async execute(body: AuthenticateDto): Promise<HttpResponse<AuthenticateResponseDto>> {
		const response = await this.authenticateUseCase.execute(body);

		if (response.isLeft()) {
			const errors = response.getLeft();

			return {
				statusCode: 401,
				content: {
					data: null,
					errors: errors.getErrors().map((error) => error.message),
				}
			};
		}

		const auth = response.getRight();

		return {
			statusCode: 200,
			content: {
				data: auth,
				errors: [],
			}
		};
	}
}
