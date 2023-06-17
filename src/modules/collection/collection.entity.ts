import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Item } from '../item/item.entity';
import { User } from '../user/user.entity';
import { FileEntity } from '../file/file.entity';

@Entity('collection')
export class Collection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  title: string;

  @OneToMany(() => Item, (item) => item.collection)
  items: Item[];

  @ManyToOne(() => User, (user) => user.collections, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @OneToOne(() => FileEntity, (file) => file.collection, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  avatar: FileEntity;
}
