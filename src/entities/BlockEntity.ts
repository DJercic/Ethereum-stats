import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

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

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'{}'",
    nullable: false,
  })
  transactions: Array<string>;
}
