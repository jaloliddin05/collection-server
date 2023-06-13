import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Item } from '../item/item.entity';

@Entity('field')
export class Field {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  type: string;

  @Column()
  key: string;

  @Column()
  value: string;

  @ManyToOne(() => Item, (item) => item)
  @JoinColumn()
  item: Item;
}
