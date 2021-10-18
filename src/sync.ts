import * as cron from 'node-cron';

import * as ethService from './services/ethereum.service';
import * as time from './utils/time';

import { getCustomRepository } from 'typeorm';
import { BlockRepository } from './repositories/blockRepository';
import log from './services/logging.service';
import { Block } from './dtos/block';

async function syncBlockDatabase() {
  /**
   * Sync block database until last entry is found in the database. If
   * this is a first start, sync the blocks until yesterday.
   */
  const blockRepo = getCustomRepository(BlockRepository);
  const latestBlock = await blockRepo.findLatest();

  const { end } = time.previousDayTimestamps();
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

async function onNewBlockHandler(block: Block) {
  /**
   * Handler when a new block
   */
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

async function storeYesterdaysStatsToContract() {
  try {
    const { start, end } = time.previousDayTimestamps();
    const blockRepo = getCustomRepository(BlockRepository);
    const stats = await blockRepo.calculateStatsBetween(start, end);
    await ethService.storeStats(
      stats.count,
      stats.sum,
      time.toPreferredDateFormat(time.previousDay())
    );
  } catch (e) {
    log.error(e);
  }
}

export async function run(cronSchedule: string) {
  /**
   * Run sync with Database and Ethereum blockchain.
   * Sync will listen for new blocks and sync them as they
   * appear on the blockchain.
   */
  log.info('Subscribe to blockchain updates');
  ethService.subscribe(onNewBlockHandler, onNewBlockError);

  log.info('Syncing until last timestamp');
  await syncBlockDatabase();

  log.info(`Starting cron schedule ${cronSchedule}`);
  cron.schedule(cronSchedule, storeYesterdaysStatsToContract, {
    timezone: 'UTC',
  });
}
