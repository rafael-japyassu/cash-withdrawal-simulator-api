import { ApplicationError } from '@/application/@core/application-error';

export class UserEmailAlreadyExistsException extends ApplicationError {
	constructor() {
		super('User email already used.');
	}
}