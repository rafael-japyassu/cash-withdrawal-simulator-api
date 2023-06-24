import { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('users', (table) => {
		table.uuid('id').primary();
		table.string('name', 255).notNullable();
		table.string('email', 255).notNullable().unique();
		table.string('password', 255).notNullable();
		table.decimal('balance', 10, 2).notNullable();
		table.timestamps();
	});
}


export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('users');
}

