import fastify, { FastifyInstance, HTTPMethods } from 'fastify';
import cors from '@fastify/cors';
import { HttpRunner } from '../types/http-runner';
import { HttpRouter } from '../types/http-router';
import { ZodError } from 'zod';
import { FastifyMapper } from '../mappers/fastify.mapper';
import { AuthenticateMiddleware } from '@/infra/modules/auth/middlewares/authenticate.middleware';
import { JwtAuthGateway } from '@/infra/modules/auth/gateways/jwt-auth.gateway';
import { UnauthorizedException } from '@/infra/modules/auth/exceptions/unauthorized-exception';
import { InvalidJwtException } from '@/infra/modules/auth/exceptions/invalid-jwt-exception';
import { UserRoutes } from '@/infra/modules/user/http/routes';
import { AuthenticateRoutes } from '@/infra/modules/auth/http/routes';
import { TransactionRoutes } from '@/infra/modules/transaction/http/routes';

export class FastifyGateway extends HttpRunner {
	private readonly app: FastifyInstance;
	private readonly API_ROUTE_PREFIX = '/api';

	private readonly userRoutes: HttpRouter;
	private readonly authRoutes: HttpRouter;
	private readonly transactionRoutes: HttpRouter;

	constructor() {
		super();
		this.app = fastify();

		this.userRoutes = new UserRoutes();
		this.authRoutes = new AuthenticateRoutes();
		this.transactionRoutes = new TransactionRoutes();

	}

	protected listen(): void {
		const port = Number(process.env.PORT) || 3333;

		this.app.register(cors);

		this.app.listen(
			{
				host: '0.0.0.0',
				port,
			},
			() => {
				console.log(
					`Server running at Fastify server on http://localhost:${port}`
				);
			}
		);
	}
	protected initRoutes(): void {
		const appRoutes = [
			...this.userRoutes.getRoutes(),
			...this.authRoutes.getRoutes(),
			...this.transactionRoutes.getRoutes(),
		];

		this.app.register(
			(app, _, next) => {
				appRoutes.forEach(({ handler, method, path, useAuthenticate }) => {
					app.route({
						method: method as HTTPMethods,
						url: path,
						handler: async (request, reply) => {
							const data = await handler(request, reply);

							return FastifyMapper.mapFromResponse(data, reply);
						},
						preHandler: [
							async (request) => {
								if (useAuthenticate) {
									const ensureAuthMiddleware = new AuthenticateMiddleware(
										new JwtAuthGateway()
									);
									const token = request.headers.authorization;

									await ensureAuthMiddleware.execute({ token, request });
								}
							},
						],
					});
				});

				next();
			},
			{ prefix: this.API_ROUTE_PREFIX }
		);
	}

	protected loadMiddlewares(): void {

		this.app.setErrorHandler((error, _, reply) => {
			if (error instanceof ZodError) {
				return reply.status(400).send({
					data: null,
					errors: error.format(),
				});
			}

			if (
				error instanceof UnauthorizedException ||
        error instanceof InvalidJwtException
			) {
				return reply.status(401).send({
					data: null,
					errors: [error.message],
				});
			}

			if (process.env.NODE_ENV !== 'production') {
				console.error(error);
			}

			return reply.status(500).send({ message: 'Internal server error.' });
		});
	}
}
