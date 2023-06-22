import { randomUUID } from 'crypto';

export class UserID {
	private constructor(private readonly value: string) {}

	static generate(): UserID {
		return new UserID(randomUUID());
	}

	static from(id: string): UserID {
		return new UserID(id);
	}

	getValue() {
		return this.value;
	}
}
