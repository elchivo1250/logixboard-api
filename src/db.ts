import { Dialect, Sequelize } from 'sequelize';

const databaseName: string = process.env.MARIADB_DATABASE as string;
const username: string = process.env.MARIADB_USER as string;
const password: string = process.env.MARIADB_PASSWORD as string;
const host: string = process.env.MARIADB_HOST as string;
const dialect: Dialect = 'mariadb' as Dialect;
const pool: any = {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
};

export const connection: any = new Sequelize(databaseName, username, password, {
  host,
  dialect,
  pool,
});

export class NotFoundError extends Error {}