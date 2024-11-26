import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { BaseEntity, User } from "./index";

export enum BrandStatus {
  ARCHIVE = "ARCHIVE",
  DRAFT = "DRAFT",
  PUBLISH = "PUBLISH",
}

@Entity()
export class Brand extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Index()
  id: string;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: "user" })
  user: User;

  @Column({ type: "json", nullable: true })
  brandCategory: object;

  @Column({ type: "varchar", length: 500, nullable: true })
  brandImages: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  imageKey: string;

  @Column({ type: "json", nullable: true })
  coverImages: object;

  @Column({ type: "json", nullable: true })
  details: object;

  @Column({ type: "json", nullable: true })
  location: object;

  @Column({
    type: "enum",
    enum: BrandStatus,
    default: BrandStatus.DRAFT,
  })
  status: BrandStatus;
}
