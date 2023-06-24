import { ApplicationError } from '@/application/@core/application-error';

export class UserEmailPasswordIncorrectException extends ApplicationError {
	constructor() {
		super('User email or password incorrect.');
	}
}