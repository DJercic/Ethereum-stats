import test from 'ava';

import * as config from './../config';

test.after.always('Clear configuration, always', () => {
  console.log('Clearing config...');
  config.clear();
});

test('Test loading configuration from env file', async (t) => {
  config.autoload({ path: '.env.test', override: true });
  t.assert(config.need('NODE_ENV') === 'test');
});

test('Test loading configuration from object', async (t) => {
  config.autoload({ static: { SUPER: 'Super' }, override: true });
  t.assert(config.need('SUPER') === 'Super');
});
