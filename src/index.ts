import * as cron from 'node-cron';
import { getCustomRepository } from 'typeorm';

import { autoload } from './config';
import { BlockRepository } from './repositories/blockRepository';
import * as dbService from './services/db.service';
import { fetchUntil, subscribe } from './services/ethereum.service';
import log from './services/logging.service';
import * as time from './type/time';

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

async function writeStatsToContract() {
  const {start, end} = time.previousDayTimestamps();
  console.log(start, end);
  const blockRepo = getCustomRepository(BlockRepository);
  const allBetween = await blockRepo.calculateStatsBetween(
    1634342400,
    1634381907
  );
  console.log('Bigger');
  console.log(allBetween);
}

async function main() {
  autoload({ path: '.env' });
  await dbService.setup();

  log.info('Starting ethereum stats service');
  subscribe(onNewBlock, onNewBlockError);

  log.info('Syncing until last timestamp');
  await syncUntilLastDatabaseEntry();
  cron.schedule('* * * * *', writeStatsToContract, { timezone: 'UTC' });
}

main();
