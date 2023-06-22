export class ApplicationError extends Error {
	constructor(readonly message: string) {
		super(message);
	}
}