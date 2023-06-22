
import { Validation, ValidationHandler } from '../validation-handler';

export class NotificationHandler extends ValidationHandler {
	private constructor(private readonly errors: Error[]) {
		super();
	}

	static create(errors?: Error[]) {
		return new NotificationHandler(errors || []);
	}

	append(error: Error): ValidationHandler {
		this.errors.push(error);
		return this;
	}

	validate(validation: Validation): ValidationHandler {
		try {
			validation.validate();
		} catch (err) {
			this.errors.push(err);
		}

		return this;
	}

	getErrors(): Error[] {
		return this.errors;
	}
}
