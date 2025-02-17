import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class Logs extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "json", nullable: true })
    message: object;
    @Column()
    level: string;

}