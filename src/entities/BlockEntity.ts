import { Entity, PrimaryColumn, Column } from 'typeorm';

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
  @Column()
  hash: string;
  @Column()
  timestamp: number;
}
