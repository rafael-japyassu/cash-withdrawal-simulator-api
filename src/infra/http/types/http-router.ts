import { HttpResponse } from './http-controller';

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

export type HttpRouterData = {
  method: HttpMethod;
  path: string;
  handler: (request: any, response: any) => Promise<HttpResponse<any>>;
  useAuthenticate?: boolean;
}

export abstract class HttpRouter {
	abstract getRoutes(): HttpRouterData[];
}
