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
import { User } from '../user/user.entity';
import { Comment } from '../comment/comment.entity';

@Entity('item')
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @Column({ type: 'int', default: 0 })
  likesCount: number;

  @ManyToOne(() => Collection, (collection) => collection.items, {
    onDelete: 'CASCADE',
    cascade: true,
  })
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

  @ManyToMany(() => User, (user) => user, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  likedUsers: User[];

  @OneToMany(() => Comment, (comment) => comment.item)
  comments: Comment[];
}
