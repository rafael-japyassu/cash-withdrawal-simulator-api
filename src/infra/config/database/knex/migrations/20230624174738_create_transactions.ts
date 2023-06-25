import { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('transactions', (table) => {
		table.uuid('id').primary();
		table.uuid('user_id').notNullable();
		table.foreign('user_id').references('id').inTable('users').onDelete('set null');
		table.string('title', 255).notNullable();
		table.string('type', 20).notNullable();
		table.decimal('value', 10, 2).notNullable();
		table.timestamps();
	});
}


export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('transactions');
}

