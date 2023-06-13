import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../../infra/shared/types';

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

  public async hashPassword(password: string): Promise<void> {
    this.password = await bcrypt.hash(password, 10);
  }

  public isPasswordValid(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
