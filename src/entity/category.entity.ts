/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";
import { BaseEntity } from "./base.entity";
export enum CategoryType {
  EVENTS = "EVENTS",
  SPACES = "SPACES",
  BRANDS = "BRANDS",
}
@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Index()
  id: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  name: string;

  @Column({
    type: "enum",
    enum: CategoryType,
    default: CategoryType.BRANDS,
  })
  categoryType: CategoryType;
}
