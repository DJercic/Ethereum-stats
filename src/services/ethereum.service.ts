import fs from 'fs/promises';

import { once } from 'ramda';
import Web3 from 'web3';

import { need } from '../config';
import { Block } from '../dtos/block';

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

export async function* fetchUntil(
  condition: (block: Block) => boolean
): AsyncIterableIterator<Block> {
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

export function subscribe(
  onData: (blockHeader?: Block) => {},
  onError: (err: Error) => {}
) {
  web3()
    .eth.subscribe('newBlockHeaders', async (err, blockHeader) => {
      if (err) {
        throw err;
      }
      const block = await fetchBlock(blockHeader.number);
      return onData(block);
    })
    .on('error', onError);
}

export async function depositStats(
  numberOfTransactions: number,
  sumOfGasFees: number,
  date: string
) {
  /***
   *
   */
  const Contract = web3().eth.Contract;
  const jsonInterface = await abi();
  const contract = new Contract(jsonInterface);

  const response = await contract.methods
    .store(numberOfTransactions, sumOfGasFees, date)
    .send();
  console.log(response);
  return response;
}

function initWeb3(): Web3 {
  const url = need('ETHEREUM_NODE_URL');
  const web = new Web3(
    new Web3.providers.WebsocketProvider(url, {
      reconnect: {
        auto: true,
        delay: 5000, // ms
        maxAttempts: 5,
        onTimeout: true,
      },
    })
  );

  const account = web.eth.accounts.privateKeyToAccount(
    need('ACCOUNT_PRIVATE_KEY')
  );
  web.eth.accounts.wallet.add(account);
  web.eth.defaultAccount = account.address;
  return web;
}

async function loadAbi() {
  const fileName = 'contract_DailyStatsContract_sol_DailyStats';
  const abi = await fs.readFile(`./contract/artifacts/${fileName}.abi`);
  return JSON.parse(abi.toString('utf-8'));
}

// Function that will ensure that initWeb3 is executed only once
const web3 = once(initWeb3);
const abi = once(loadAbi);
