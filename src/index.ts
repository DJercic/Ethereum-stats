import * as cron from 'node-cron';
import { getCustomRepository } from 'typeorm';

import { autoload } from './config';
import { BlockRepository } from './repositories/blockRepository';
import * as dbService from './services/db.service';
import * as ethService from './services/ethereum.service';
import log from './services/logging.service';
import * as time from './type/time';

async function syncBlockDatabase() {
  const blockRepo = getCustomRepository(BlockRepository);

  const { end } = time.previousDayTimestamps();
  const latestBlock = await blockRepo.findLatest();
  /**
   * If the database is empty fetch block for today.
   * If there is something in the db fetch until last entry.
   */
  const condition = latestBlock
    ? (block) => block.number === latestBlock.number
    : (block) => block.timestamp <= end;

  const iterateBlocks = ethService.fetchUntil(condition);
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
  const { start, end } = time.previousDayTimestamps();
  const blockRepo = getCustomRepository(BlockRepository);
  const stats = await blockRepo.calculateStatsBetween(start, end);
  await ethService.depositStats(stats.count, stats.sum, '2021-10-18');
}

async function main() {
  autoload({ path: '.env' });
  await dbService.setup();

  log.info('Starting ethereum stats service');
  // Subscribe on live blocks from Ethereum network
  ethService.subscribe(onNewBlock, onNewBlockError);

  log.info('Syncing until last timestamp');

  await syncBlockDatabase();
  cron.schedule('* * * * *', writeStatsToContract, { timezone: 'UTC' });
}

main();
