import test from 'ava';

import * as config from './../config';
import * as dbService from './../services/db.service';

test.beforeEach(() => {
  config.autoload({ path: '.env.test' });
});

test.after.always(() => {
  config.clear();
});

test('Connecting to a database', async (t) => {
  const conn = await dbService.setup();
  await conn.dropDatabase();
  t.assert(conn.driver);
});
