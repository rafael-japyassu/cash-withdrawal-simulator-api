import { FastifyRequest, FastifyReply } from 'fastify';
import {
	HttpRequestBody,
	HttpRequestParams,
	HttpRequestQueryParams,
	HttpResponse,
} from '../types/http-controller';

export class FastifyMapper {
	static mapBody<T extends HttpRequestBody = HttpRequestBody>(
		request: FastifyRequest
	): T {
		return request.body as T;
	}

	static mapParams<T extends HttpRequestParams = HttpRequestParams>(
		request: FastifyRequest
	): T {
		return request.params as T;
	}

	static mapQueryParams<T extends HttpRequestQueryParams = HttpRequestQueryParams>(
		request: FastifyRequest
	): T {
		return request.query as T;
	}

	static mapFromResponse<T>(
		controllerResponse: HttpResponse<T>,
		reply: FastifyReply
	): FastifyReply {
		if (controllerResponse?.statusCode === 204) {
			return reply.status(controllerResponse.statusCode).send();
		}

		return reply
			.status(controllerResponse?.statusCode || 200)
			.send(controllerResponse.content);
	}
}
