import { EntityRepository, Repository } from 'typeorm';

import { BlockEntity } from '../entities/BlockEntity';

@EntityRepository(BlockEntity)
export class BlockRepository extends Repository<BlockEntity> {
  findLatest() {
    return this.createQueryBuilder('block')
      .select('Max(block.number)')
      .getOne();
  }

  findAllBetween(start: number, end: number) {
    return this.createQueryBuilder('block')
      .where('block.timestamp > :start', { start })
      .andWhere('block.timestamp < :end', { end })
      .getMany();
  }
}
