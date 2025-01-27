import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { BaseEntity, User, Brand, Events, Spaces } from "./index";

export enum SavedEntityType {
  BRAND = "BRAND",
  EVENT = "EVENT",
  SPACE = "SPACE",
}

@Entity()
export class SavedEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.savedEntities, { cascade: true })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({
    type: "enum",
    enum: SavedEntityType,
    nullable: false,
  })
  type: SavedEntityType;

  @ManyToOne(() => Brand, (brand) => brand.id, { nullable: true })
  @JoinColumn({ name: "brandId" })
  brand: Brand;

  @ManyToOne(() => Events, (event) => event.id, { nullable: true })
  @JoinColumn({ name: "eventId" })
  event: Events;

  @ManyToOne(() => Spaces, (space) => space.id, { nullable: true })
  @JoinColumn({ name: "spaceId" })
  space: Spaces;
}
