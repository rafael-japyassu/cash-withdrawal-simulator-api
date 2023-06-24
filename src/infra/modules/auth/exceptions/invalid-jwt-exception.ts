export class InvalidJwtException extends Error {
	constructor() {
		super('Invalid Jwt token');
	}
}
