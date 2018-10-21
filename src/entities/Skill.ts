import { Entity, OneToOne, ManyToOne, JoinColumn, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { Contains } from "class-validator";

@Entity()
export class Skill extends BaseEntity {

    @Column({
        unique: true
    })
    name: string;

    @Column()
    title: string;
}