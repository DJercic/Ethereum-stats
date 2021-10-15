import { autoload } from './config';
import * as dbService from './services/db.service';
import { fetchUntil, subscribe } from './services/ethereum.service';
import log from './services/logging.service';
import { getCustomRepository } from 'typeorm';
import { BlockRepository } from './repositories/BlockRepository';

async function syncUntilLastDatabaseEntry() {
  const blockRepo = getCustomRepository(BlockRepository);

  const latestBlock = await blockRepo.findLatest();
  const iterateBlocks = fetchUntil(
    (block) => block.number === latestBlock.number
  );
  for await (const block of iterateBlocks) {
    log.info(`Fetched block ${block.number}`);
    await blockRepo.save(block);
    log.info(`Synced block ${block.number}`);
  }
}

async function onNewBlock(block) {
  if (!block) {
    // This case popped up while listening to Ethereum blockchain,
    // although the typings suggest that an empty block is not possible.
    log.error('Received an empty block');
  }
  log.info(`New block ${block.number}`);
  const blockRepo = getCustomRepository(BlockRepository);
  const saved = await blockRepo.upsert(block);
  if (saved) {
    log.info(`Synced block ${block.number}`);
  } else {
    log.warn(`Block ${block.number} already exists`);
  }
}

async function onNewBlockError(err: Error) {
  log.error(err);
  throw err;
}

async function main() {
  autoload();
  await dbService.setup();

  log.info('Starting ethereum stats service');
  subscribe(onNewBlock, onNewBlockError);

  log.info('Syncing until last timestamp');
  await syncUntilLastDatabaseEntry();
}

main();
