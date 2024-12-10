import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { BaseEntity, User, Brand } from "./index";

export enum SpaceStatus {
  ARCHIVE = "ARCHIVE",
  DRAFT = "DRAFT",
  PUBLISH = "PUBLISH",
}

@Entity()
export class Spaces extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.spaces, { cascade: true })
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Brand, (brand) => brand.id, { nullable: true })
  @JoinColumn({ name: "brand" })
  brand: Brand;

  @Column({ type: "varchar", length: 100, nullable: false })
  spaceName: string;

  @Column({ type: "json", nullable: true })
  spaceCategory: object;

  @Column({ type: "varchar", length: 500, nullable: true })
  spaceImage: string;

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
  amenity: object;

  @Column({
    type: "enum",
    enum: SpaceStatus,
    default: SpaceStatus.DRAFT,
  })
  status: SpaceStatus;
}
