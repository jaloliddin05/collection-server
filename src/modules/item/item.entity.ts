import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Collection } from '../collection/collection.entity';
import { Tag } from '../tag/tag.entity';

@Entity('item')
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @ManyToOne(() => Collection, (collection) => collection.items)
  @JoinColumn()
  collection: Collection;

  @ManyToMany(() => Tag, (tag) => tag.items, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  tags: Tag[];
}
