import { once } from 'ramda';
import { Connection, createConnection } from 'typeorm';

import { need, read } from '../config';

async function _setup(): Promise<Connection> {
  const connection = await createConnection({
    name: read('DB_CONNECTION_NAME', 'default'),
    type: 'postgres',
    host: need('DB_HOST'),
    port: Number(read('DB_PORT', '5432')),
    username: need('DB_USER'),
    password: need('DB_PASS'),
    database: need('DB_NAME'),
    entities: ['entities/*.js'],
  });
  return connection;
}

export const setup = once(_setup);
