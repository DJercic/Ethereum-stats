import { EntityRepository, Repository } from 'typeorm';

import { BlockEntity } from '../entities/BlockEntity';

@EntityRepository(BlockEntity)
export class BlockRepository extends Repository<BlockEntity> {
  findLatest() {
    return this.createQueryBuilder('block')
      .select('Max(block.number)')
      .getOne();
  }
}
