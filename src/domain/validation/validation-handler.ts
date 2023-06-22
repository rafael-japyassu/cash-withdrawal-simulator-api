export interface Validation {
	validate(): void;
}

export abstract class ValidationHandler {
	abstract append(error: Error): ValidationHandler;
	abstract validate(validation: Validation): ValidationHandler;
	abstract getErrors(): Error[];

	hasErrors() {
		return this.getErrors().length > 0;
	}
}
