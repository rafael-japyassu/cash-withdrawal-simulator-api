import { ValidationHandler } from './validation-handler';

export abstract class Validator {
	protected constructor(readonly handler: ValidationHandler) {}

	abstract validate(): void;

	protected validationHandler(): ValidationHandler {
		return this.handler;
	}
}
