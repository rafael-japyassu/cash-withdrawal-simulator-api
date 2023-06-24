import { ApplicationError } from '@/application/@core/application-error';

export class InvalidAmountBankWithdrawalException extends ApplicationError {
	constructor() {
		super('It is not possible to withdraw this value.');
	}
}