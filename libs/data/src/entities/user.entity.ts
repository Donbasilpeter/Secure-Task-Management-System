import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  email!: string;

  // store a bcrypt hash here
  @Column({ type: 'varchar', length: 255 })
  passwordHash!: string;

  // optional role/claims
  @Column({ type: 'varchar', length: 50, default: 'user' })
  role!: string;
}
