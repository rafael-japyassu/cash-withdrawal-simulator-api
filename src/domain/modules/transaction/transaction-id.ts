import { randomUUID } from 'crypto';

export class TransactionID {
	private constructor(private readonly value: string) {}

	static generate(): TransactionID {
		return new TransactionID(randomUUID());
	}

	static from(id: string): TransactionID {
		return new TransactionID(id);
	}

	getValue() {
		return this.value;
	}
}
