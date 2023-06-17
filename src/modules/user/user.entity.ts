import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Collection } from '../collection/collection.entity';
import { UserRole } from '../../infra/shared/types';
import { FileEntity } from '../file/file.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: 1 })
  role: UserRole;

  @Column({ type: 'timestamp', nullable: false, default: () => 'NOW()' })
  createdAt: string;

  @OneToMany(() => Collection, (collection) => collection.user)
  collections: Collection[];

  @OneToOne(() => FileEntity, (file) => file.user, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  avatar: FileEntity;

  public async hashPassword(password: string): Promise<void> {
    this.password = await bcrypt.hash(password, 10);
  }

  public isPasswordValid(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
