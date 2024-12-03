import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";
import { BaseEntity } from "./index";

@Entity()
export class Amenities extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Index()
  id: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  amenitiesName: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  amenitiesImage: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  imageKey: string;
}
