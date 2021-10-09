export interface Block {
  /*
   Modeled based on https://web3js.readthedocs.io/en/v1.5.2/web3-eth.html#id59
   */

  /* The block number. null if a pending block. */
  number?: Number;
  /* Timestamp of the block creation */
  timestamp: Number; //1633795408,
  /* Hash of the block. null if a pending block. */
  hash?: string;
  /* Hash of the parent block */
  parentHash: string;
  /* 
  Used as a multiplier to determine total transaction value.
  Determined by the network and the utilization of the last block.
  https://www.blocknative.com/blog/eip-1559-fees
  totalValue = gasUsed * (baseFeePerGas + tip)
  */
  baseFeePerGas: string;
  /* Integer of the difficulty for this block. */
  difficulty: string;
  /* Any extra data associated with the transaction */
  extraData: string;
  /* Max that can be spend on the transaction */
  gasLimit: Number;
  /* Actual gas used */
  gasUsed: Number;
  /* The bloom filter for the logs of the block. null if a pending block. */
  logsBloom: string;
  /* Address of the miner who mined the block */
  miner: string;
  /* */
  mixHash: string;
  /* Hash of the generated proof-of-work. null if a pending block */
  nonce?: string;
  /* */
  receiptsRoot: string;
  /* */
  sha3Uncles: string;
  /* Integer the size of this block in bytes. */
  size: Number;
  /* */
  stateRoot: string;
  /* Integer of the total difficulty of the chain until this block. */
  totalDifficulty: string;
  /* Transaction hashes that were confirmed with the block. */
  transactions: Array<string>;
  /* The root of the transaction trie of the block. */
  transactionsRoot: string;
  /* All the other miners that computed the hash but message came in after the block was excepted. 
  Block can have max of 7 uncles. */
  uncles: Array<string>;
}
