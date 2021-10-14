import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Block {
  @PrimaryColumn()
  id: number;
  gasLimit: number;
  gasUsed: number;
  miner: string;
  hash: string;
  timestamp: number;
}
