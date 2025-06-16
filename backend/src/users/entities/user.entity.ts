import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Occurrence } from "../../occurrences/entities/occurrence.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @OneToMany(() => Occurrence, (occurrence) => occurrence.created_by)
  occurrences: Occurrence[];
}
