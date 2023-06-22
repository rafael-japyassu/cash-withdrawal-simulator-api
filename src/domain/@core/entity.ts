import { ValidationHandler } from '../validation/validation-handler';

export abstract class Entity<ID> {
	protected constructor(protected readonly id: ID) {
		if (!id) {
			throw new Error('"id" should not be null');
		}
	}

  abstract validate(handler: ValidationHandler): void;

  getId(): ID {
  	return this.id;
  }
}
