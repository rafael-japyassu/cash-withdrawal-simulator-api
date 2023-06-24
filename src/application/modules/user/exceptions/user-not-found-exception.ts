import { ApplicationError } from '@/application/@core/application-error';

export class UserNotFoundException extends ApplicationError {
	constructor() {
		super('User not found.');
	}
}