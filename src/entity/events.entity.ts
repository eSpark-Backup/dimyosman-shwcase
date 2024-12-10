import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { BaseEntity, User, Brand, Spaces } from "./index";

export enum EventStatus {
  ARCHIVE = "ARCHIVE",
  DRAFT = "DRAFT",
  PUBLISH = "PUBLISH",
}

@Entity()
export class Events extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.events, { cascade: true })
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Brand, (brand) => brand.id, { nullable: true })
  @JoinColumn({ name: "brand" })
  brand: Brand;

  @ManyToOne(() => Spaces, (space) => space.id, { nullable: true })
  @JoinColumn({ name: "space" })
  space: Spaces;

  @Column({ type: "varchar", length: 100, nullable: false })
  eventName: string;

  @Column({ type: "json", nullable: true })
  eventCategory: object;

  @Column({ type: "varchar", length: 500, nullable: true })
  eventImage: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  imageKey: string;

  @Column({ type: "json", nullable: true })
  coverImages: object;

  @Column({ type: "json", nullable: true })
  details: object;

  @Column({ type: "varchar", length: 256, nullable: true })
  minLeaseDays: string;

  @Column({ type: "json", nullable: true })
  location: object;

  @Column({ type: "json", nullable: true })
  eventDate: object;

  @Column({
    type: "enum",
    enum: EventStatus,
    default: EventStatus.DRAFT,
  })
  status: EventStatus;
}
