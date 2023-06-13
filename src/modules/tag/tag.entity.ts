import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from '../item/item.entity';

@Entity('tag')
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  title: string;

  @ManyToMany(() => Item, (item) => item.tags, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  items: Item[];
}
