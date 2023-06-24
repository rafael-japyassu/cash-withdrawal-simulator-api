export interface IHttpMiddleware<Input = unknown> {
  execute(input: Input): Promise<void>;
}
