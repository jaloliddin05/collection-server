import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Collection } from '../collection/collection.entity';
import { Tag } from '../tag/tag.entity';
import { Field } from '../field/field.entity';
import { FileEntity } from '../file/file.entity';

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

  @OneToMany(() => Field, (field) => field.item)
  fields: Field[];

  @OneToOne(() => FileEntity, (file) => file.item, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  avatar: FileEntity;
}
