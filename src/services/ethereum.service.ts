import Web3 from 'web3';

import { need } from '../config';
import { Block } from '../dtos/block';
import { once } from 'ramda';

export async function fetchBlock(
  blockHashOrBlockNumber: number | string
): Promise<Block> {
  /**
   * Create to avoid writing conversion to Block every time
   */
  const block = (await web3().eth.getBlock(blockHashOrBlockNumber)) as unknown;
  return block as Block;
}

export async function fetchLatestBlock(): Promise<Block> {
  const block = (await web3().eth.getBlock('latest')) as unknown;
  return block as Block;
}

export async function* fetchUntil(condition: (block: Block) => boolean) {
  /**
   * Fetch until a condition is met.
   * Example:
   *  for await (const b of fetchUntil((block) => block.number != 12345)) {...}
   *  for await (const b of fetchUntil((block) => block.timestamp > 16894343433)) {...}
   */
  const latestBlock = await fetchLatestBlock();
  let block = latestBlock;
  while (!condition(block)) {
    block = await fetchBlock(block.parentHash);
    yield block;
  }
}

function initWeb3(): Web3 {
  const url = need('ETHEREUM_NODE_URL');
  return new Web3(url);
}
// Function that will ensure that initWeb3 is executed only once
const web3 = once(initWeb3);
