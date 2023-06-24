import { ApplicationRunner } from './infra/app';
import { FastifyGateway } from './infra/http/gateways/fastify.gateway';

export async function bootstrap() {
	const fastifyGateway = new FastifyGateway();
	const app = new ApplicationRunner(fastifyGateway);

	app.init();
}

bootstrap();
