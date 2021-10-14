import fs from 'fs/promises';

import * as dbService from './services/db.service';
import { fetchUntil } from './services/ethereum.service';
import log from './services/logging.service';
import { autoload } from './config';

log.info('Starting ethereum stats service');

const SUNDAY_OCT_10 = 1633824000;

async function run() {
  autoload();
  await dbService.setup();
  const blocks = fetchUntil((block) => block.timestamp <= SUNDAY_OCT_10);

  for await (const block of blocks) {
    log.info(`Fetched block ${block.number}`);
    await fs.writeFile(`blocks/${block.number}.json`, JSON.stringify(block));
  }
}

run();
