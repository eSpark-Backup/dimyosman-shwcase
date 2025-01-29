import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { BaseEntity, User, Events } from "./index";

@Entity()
export class RSVP extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.rsvps, { cascade: true })
  @JoinColumn({ name: "user" })
  user: User;

  @ManyToOne(() => Events, (event) => event.id, { cascade: true })
  @JoinColumn({ name: "event" })
  event: Events;

  @Column({ type: "json", nullable: false })
  attendanceDates: object;

  @Column({ type: "boolean", default: false })
  verifyAttendance: boolean;

  @Column({ type: "varchar", nullable: true })
  review: string;

  @Column({ type: "varchar", nullable: true })
  rating: number;
}
