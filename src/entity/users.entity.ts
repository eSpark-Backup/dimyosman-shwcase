/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { Spaces } from "./spaces.entity";
import { Events } from "./events.entity";
import { Brand } from "./brands.entity";
export enum LoginType {
  LOCAL = "local",
  FACEBOOK = "facebook",
  GOOGLE = "google",
  APPLE = "apple",
}
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Index()
  id: string;

  @Column({ type: "varchar", length: 100, unique: false })
  name: string;

  @Column({ type: "varchar", length: 100, unique: true })
  email: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  socialId: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  profileImage: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  imageKey: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  password: string;

  @Column({ type: "varchar", length: 50, nullable: true, default: "user" })
  role: string;
  @Column({
    type: "enum",
    enum: LoginType,
    default: LoginType.LOCAL,
  })
  loginType: LoginType;

  @Column({
    type: "boolean",
    default: false,
  })
  isSocialLogin: boolean;

  @OneToMany(() => Spaces, (space) => space.user)
  spaces: Spaces[];

  @OneToMany(() => Events, (event) => event.user)
  events: Events[];

  @OneToMany(() => Brand, (brand) => brand.user)
  brands: Brand[];
}
