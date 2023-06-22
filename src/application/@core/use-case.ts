export abstract class UseCase<IN = void, OUT = void> {
  abstract execute(input: IN): Promise<OUT>;
} 