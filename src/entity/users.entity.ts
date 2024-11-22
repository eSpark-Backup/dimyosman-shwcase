/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";
import { BaseEntity } from "./base.entity";
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

  @Column({ type: "varchar", length: 255 })
  password: string;

  @Column({ type: "varchar", length: 50 })
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
}
