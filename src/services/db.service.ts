import { createConnection, Connection } from 'typeorm';
import { need, read } from '../config';

export default class DbService {
  public static async setup(): Promise<Connection> {
    const connection = await createConnection({
      name: read('DB_CONNECTION_NAME', 'default'),
      type: 'postgres',
      host: need('DB_HOST'),
      port: Number(read('DB_PORT', '3306')),
      username: need('DB_USER'),
      password: need('DB_PASS'),
      database: need('DB_NAME'),
    });
    return connection;
  }
}

// export async function initialize(): Promise<Connection> {
//   const connections = await createConnection({
//     name: read('DB_CONNECTION_NAME', 'default'),
//     type: 'postgres',
//     host: need('DB_HOST'),
//     port: Number(read('DB_PORT', '3306')),
//     username: need('DB_USER'),
//     password: need('DB_PASS'),
//     database: need('DB_NAME'),
//   });
//   return connections;
// }
