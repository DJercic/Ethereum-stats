import { Entity, PrimaryColumn, Column, Index } from 'typeorm';

@Entity({ name: 'block' })
export class BlockEntity {
  @PrimaryColumn()
  number: number;

  @Column({ name: 'gas_limit' })
  gasLimit: number;

  @Column({ name: 'gas_used' })
  gasUsed: number;

  @Column()
  miner: string;

  @Index()
  @Column()
  hash: string;

  @Index()
  @Column({ name: 'parent_hash' })
  parentHash: string;

  @Index()
  @Column()
  timestamp: number;
}
