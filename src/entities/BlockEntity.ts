import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'block' })
export class BlockEntity {
  @PrimaryColumn()
  number: number;
  @Column()
  gasLimit: number;
  @Column()
  gasUsed: number;
  @Column()
  miner: string;
  @Column()
  hash: string;
  @Column()
  timestamp: number;
}
