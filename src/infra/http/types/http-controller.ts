export type HttpRequestBody = {
  [key: string]: string | number | object;
}

export type HttpRequestParams = {
  [key: string]: string;
}

export type HttpRequestQueryParams = {
  [key: string]: string | string[];
}

export type HttpControllerRequest = {
  body: HttpRequestBody;
  params: HttpRequestParams;
  query: HttpRequestQueryParams;
}

export type HttpResponse<T = object> = {
  statusCode?: number;
  content: {
    data: T | null;
    errors: string[];
  }
}

export abstract class HttpController<IN = void, OUT = void> {
	abstract execute(data: IN): Promise<HttpResponse<OUT>>;
}
