import knex from 'knex';
import { Knex } from 'knex';

const knexConnection: Knex = knex({
	client: 'postgresql',
	connection: {
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME,
		port: Number(process.env.DB_PORT),
	},
});

export { knexConnection };
