import fs from 'fs/promises';
import path from 'path';

import test from 'ava';
import { getCustomRepository } from 'typeorm';

import { BlockRepository } from '../repositories/blockRepository';

import * as config from './../config';
import * as dbService from './../services/db.service';

const BLOCKS_LENGTH = 10000;

async function loadSeedBlocks(): Promise<Array<Record<any, any>>> {
  /***
   * Seed data contains all actual transactions on ethereum blockchain
   * that happened between October 9th 11:49 and October 11th 1:45 PM
   */
  const seedFilePath = path.resolve('res/blockSeedData.json');
  const content = await fs.readFile(seedFilePath, {
    encoding: 'utf-8',
  });
  return content
    .split('\n')
    .filter((v) => v)
    .map((line) => JSON.parse(line));
}

async function insertSeedBlocks(): Promise<number> {
  const blocks = await loadSeedBlocks();
  const blockRepo = getCustomRepository(BlockRepository);
  let chunk = [];
  for (const block of blocks) {
    chunk.push(block);
    if (chunk.length >= 500) {
      await blockRepo.insert(chunk);
      chunk = [];
    }
  }
  return blocks.length;
}

async function cleanUp() {
  config.clear();
  await dbService.truncateAllEntities();
}

test.beforeEach(async (_t) => {
  config.autoload({ path: '.env.test', override: true });
  await dbService.setup();
});
test.afterEach.always(cleanUp);

test('fetching latest block from the database when database is empty', async (t) => {
  const blockRepo = getCustomRepository(BlockRepository);
  const block = await blockRepo.findLatest();
  t.assert(block === undefined);
});

test('fetching latest block from the database when database is full', async (t) => {
  await insertSeedBlocks();
  const blockRepo = getCustomRepository(BlockRepository);
  const block = await blockRepo.findLatest();
  t.assert(block);
});

test('bulk inserting blocks', async (t) => {
  const inserts = await insertSeedBlocks();
  t.assert(inserts == BLOCKS_LENGTH);
});

test('finding all blocks between Oct 01-18', async (t) => {
  const OCT_01_21 = 1633046400;
  const OCT_18_21 = 1634515200;

  await insertSeedBlocks();
  const blockRepo = getCustomRepository(BlockRepository);
  const blocks = await blockRepo.findAllBetween(OCT_01_21, OCT_18_21);
  t.assert(blocks.length === BLOCKS_LENGTH);
});

test('finding all blocks for Oct 10', async (t) => {
  const OCT_10_FIRST_TIMESTAMP = 1633824000;
  const OCT_10_LAST_TIMESTAMP = 1633910400;
  const FIRST_BLOCK = 13387619;
  const LAST_BLOCK = 13393994;
  const FIRST_BLOCK_ON_OCT_11 = 1633910416;

  await insertSeedBlocks();
  const blockRepo = getCustomRepository(BlockRepository);
  const blocks = await blockRepo.findAllBetween(
    OCT_10_FIRST_TIMESTAMP,
    OCT_10_LAST_TIMESTAMP
  );
  const blockNumbers = new Set(blocks.map((block) => block.number));

  t.assert(blocks.length === 6375);
  t.assert(!blockNumbers.has(FIRST_BLOCK));
  t.assert(!blockNumbers.has(FIRST_BLOCK_ON_OCT_11));
  t.assert(blockNumbers.has(LAST_BLOCK));
});

test('writing duplicate block number', async (t) => {
  const blocks = await loadSeedBlocks();
  const blockRepo = getCustomRepository(BlockRepository);

  const block = blocks[0];
  t.assert(await blockRepo.upsert(block));
  t.assert(!(await blockRepo.upsert(block)));
});
