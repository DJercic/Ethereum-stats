export type Block = {
  /*
   Modeled based on https://web3js.readthedocs.io/en/v1.5.2/web3-eth.html#id59
   */

  /* The block number. null if a pending block. */
  readonly number?: number;
  /* Timestamp of the block creation */
  readonly timestamp: number; //1633795408,
  /* Hash of the block. null if a pending block. */
  readonly hash?: string;
  /* Hash of the parent block */
  readonly parentHash: string;
  /* 
  Used as a multiplier to determine total transaction value.
  Determined by the network and the utilization of the last block.
  https://www.blocknative.com/blog/eip-1559-fees
  totalValue = gasUsed * (baseFeePerGas + tip)
  */
  readonly baseFeePerGas: string;
  /* Integer of the difficulty for this block. */
  readonly difficulty: string;
  /* Any extra data associated with the transaction */
  readonly extraData: string;
  /* Max that can be spend on the transaction */
  readonly gasLimit: number;
  /* Actual gas used */
  readonly gasUsed: number;
  /* The bloom filter for the logs of the block. null if a pending block. */
  readonly logsBloom: string;
  /* Address of the miner who mined the block */
  readonly miner: string;
  /* */
  readonly mixHash: string;
  /* Hash of the generated proof-of-work. null if a pending block */
  readonly nonce?: string;
  /* */
  readonly receiptsRoot: string;
  /* */
  readonly sha3Uncles: string;
  /* Integer the size of this block in bytes. */
  readonly size: number;
  /* */
  readonly stateRoot: string;
  /* Integer of the total difficulty of the chain until this block. */
  readonly totalDifficulty: string;
  /* Transaction hashes that were confirmed with the block. */
  readonly transactions: ReadonlyArray<string>;
  /* The root of the transaction trie of the block. */
  readonly transactionsRoot: string;
  /* All the other miners that computed the hash but message came in after the block was excepted. 
  Block can have max of 7 uncles. */
  readonly uncles: ReadonlyArray<string>;
};
