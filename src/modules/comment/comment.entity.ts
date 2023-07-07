import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Item } from '../item/item.entity';
import { User } from '../user/user.entity';

@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  text: string;

  @Column({ type: 'timestamp', nullable: false, default: () => 'NOW()' })
  date: string;

  @Column({ type: 'timestamp', nullable: true })
  updatedDate: string;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Item, (item) => item.comments, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn()
  item: Item;
}
