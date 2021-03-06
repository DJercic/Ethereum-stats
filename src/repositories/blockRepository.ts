import { DeepPartial, EntityRepository, Repository } from 'typeorm';

import { BlockEntity } from '../entities/BlockEntity';

@EntityRepository(BlockEntity)
export class BlockRepository extends Repository<BlockEntity> {
  findLatest() {
    return this.createQueryBuilder('block')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .from(BlockEntity, 'b')
          .select('max(b.number)')
          .getQuery();
        return 'block.number IN ' + subQuery;
      })
      .getOne();
  }

  findAllBetween(start: number, end: number) {
    return this.createQueryBuilder('block')
      .where('block.timestamp > :start', { start })
      .andWhere('block.timestamp < :end', { end })
      .getMany();
  }

  calculateStatsBetween(start: number, end: number) {
    return this.createQueryBuilder('block')
      .select(['COUNT(DISTINCT block.number)', 'SUM(block.gasUsed)'])
      .where('block.timestamp > :start', { start })
      .andWhere('block.timestamp < :end', { end })
      .getRawOne();
  }

  async upsert<T extends DeepPartial<BlockEntity>>(block: T) {
    /**
     * Save entity into the database if the entity does not exists.
     * If entity is saved return true, if not, return false.
     */
    const existingBlock = await this.findOne({ number: block.number });
    if (existingBlock) {
      return false;
    }
    await this.save(block);
    return true;
  }
}
