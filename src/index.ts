import { autoload } from './config';
import * as dbService from './services/db.service';
import { fetchUntil } from './services/ethereum.service';
import log from './services/logging.service';
import { getCustomRepository } from 'typeorm';
import { BlockRepository } from './repositories/BlockRepository';

log.info('Starting ethereum stats service');

async function syncUntilLastDatabaseEntry() {
  const blockRepo = getCustomRepository(BlockRepository);

  const latestBlock = await blockRepo.findLatest();
  const iterateBlocks = fetchUntil(
    (block) => block.number !== latestBlock.number
  );

  for await (const block of iterateBlocks) {
    log.info(`Fetched block ${block.number}`);
    await blockRepo.save(block);
    log.info(`Saved block ${block.number}`);
  }
}

async function main() {
  autoload();
  await dbService.setup();

  await syncUntilLastDatabaseEntry();
}

main();
