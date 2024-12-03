import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { BaseEntity, User, Brand } from "./index";

export enum BrandStatus {
  ARCHIVE = "ARCHIVE",
  DRAFT = "DRAFT",
  PUBLISH = "PUBLISH",
}

@Entity()
export class Spaces extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Index()
  id: string;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: "user" })
  user: User;

  @ManyToOne(() => Brand, (brand) => brand.id, { nullable: false })
  @JoinColumn({ name: "brand" })
  brand: Brand;

  @Column({ type: "varchar", length: 100, nullable: false })
  brandName: string;

  @Column({ type: "json", nullable: true })
  brandCategory: object;

  @Column({ type: "varchar", length: 500, nullable: true })
  brandImage: string;

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
