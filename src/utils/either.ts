export type Either<L, R> = Left<L, R> | Right<L, R>;

export class Left<L, R> {
	constructor(private readonly value: L) {}

	static create<L, R>(l: L): Either<L, R> {
		return new Left(l);
	}

	getLeft(): L {
		return this.value;
	}

	getRight(): R {
		throw new Error('return is Left, use getLeft method');
	}

	isLeft() {
		return true;
	}

	isRight() {
		return false;
	}
}

export class Right<L, R> {
	constructor(private readonly value: R) {}

	static create<L, R>(r: R): Either<L, R> {
		return new Right(r);
	}

	getLeft(): L {
		throw new Error('return is Right, use getRight method');
	}

	getRight(): R {
		return this.value;
	}

	isLeft() {
		return false;
	}

	isRight() {
		return true;
	}
}
