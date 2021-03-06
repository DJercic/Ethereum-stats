import { once } from 'ramda';
import { Connection, createConnection, getConnection } from 'typeorm';

import { need, read } from '../config';
import { BlockEntity } from '../entities/BlockEntity';

async function _setup(): Promise<Connection> {
  const connection = await createConnection({
    name: read('DB_CONNECTION_NAME', 'default'),
    type: 'postgres',
    host: need('DB_HOST'),
    port: Number(read('DB_PORT', '5432')),
    username: need('DB_USER'),
    password: need('DB_PASS'),
    database: need('DB_NAME'),
    entities: [BlockEntity],
    migrationsRun: true,
    migrationsTableName: 'meta_migration',
    synchronize: true,
  });

  return connection;
}

export async function truncateAllEntities() {
  /**
   * Truncate all registered entities .
   */
  const entities = getConnection().entityMetadatas;

  for (const entity of entities) {
    const repository = getConnection().getRepository(entity.name);
    await repository.clear();
  }
}

export const setup = once(_setup);
