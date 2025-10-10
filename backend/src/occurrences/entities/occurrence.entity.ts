import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

export enum OccurrenceStatus {
  OPEN = "open",
  CLOSED = "closed",
  ABANDONED = "abandoned",
}

@Entity("occurrences")
export class Occurrence {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.occurrences, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: "created_by" })
  created_by: User;

  @Column({ nullable: true })
  closed_at: Date;

  @Column({ nullable: false })
  description: string;

  @Column({
    type: "enum",
    enum: OccurrenceStatus,
    nullable: false,
  })
  status: OccurrenceStatus;
}
