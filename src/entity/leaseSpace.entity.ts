import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User, Spaces, BaseEntity } from "./index";

export enum LeaseStatus {
  PENDING = "Pending",
  SUBMIT_FOR_SIGNATURE = "SubmitForSignature",
  VERIFY_AND_PAY = "VerifyAndPay",
  READY_FOR_REVIEW = "ReadyForReview",
}

@Entity()
export class LeaseSpace extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Spaces, (space) => space.id, { nullable: false })
  @JoinColumn({ name: "spaceId" })
  space: Spaces;

  @Column({ type: "varchar", length: 100, nullable: false })
  chatId: string;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: "tenantId" })
  tenant: User;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: "ownerId" })
  owner: User;

  @Column({ type: "json", nullable: false })
  contractDetails: object;

  @Column({
    type: "enum",
    enum: LeaseStatus,
    default: LeaseStatus.SUBMIT_FOR_SIGNATURE,
  })
  status: LeaseStatus;
}
