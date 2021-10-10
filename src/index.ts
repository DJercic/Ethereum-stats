import log from './services/logging.service';
import { fetchUntil } from './services/ethereum.service';

log.info('Starting ethereum stats service');

const fs = require('fs');
const { promisify } = require('util');

const writeFileAsync = promisify(fs.writeFile);

let i = 0;

const condition = (_block: any) => {
  i += 1;
  return i > 10;
};

async function run() {
  for await (const block of fetchUntil(condition)) {
    log.info(`Fetched block ${block.number}`);
    await writeFileAsync(`${block.number}.json`, JSON.stringify(block));
  }
}

run();
