import log from './services/logging.service';
import { fetchUntil } from './services/ethereum.service';

log.info('Starting ethereum stats service');

const fs = require('fs');
const { promisify } = require('util');

const writeFileAsync = promisify(fs.writeFile);

const SUNDAY_OCT_10 = 1633824000;

async function run() {
  const blocks = fetchUntil((block) => block.timestamp <= SUNDAY_OCT_10);

  for await (const block of blocks) {
    log.info(`Fetched block ${block.number}`);
    await writeFileAsync(`blocks/${block.number}.json`, JSON.stringify(block));
  }
}

run();
