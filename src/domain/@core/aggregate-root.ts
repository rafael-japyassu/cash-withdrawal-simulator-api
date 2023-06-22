import { Entity } from './entity';

export abstract class AggregateRoot<ID> extends Entity<ID> {
	protected constructor(protected id: ID) {
		super(id);
	}
}
