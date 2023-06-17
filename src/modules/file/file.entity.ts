import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
} from 'typeorm';

import { User } from '../user/user.entity';
import { Collection } from '../collection/collection.entity';
import { Item } from '../item/item.entity';

@Entity({ name: 'file' })
export class FileEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  path: string;

  @OneToOne(() => User, (user) => user.avatar, {
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToOne(() => Collection, (collection) => collection.avatar, {
    onDelete: 'CASCADE',
  })
  collection: Collection;

  @OneToOne(() => Item, (item) => item.avatar, {
    onDelete: 'CASCADE',
  })
  item: Item;
}
