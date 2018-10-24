import { Entity, OneToOne, ManyToOne, JoinColumn, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { Contains, IsNotEmpty, Matches } from "class-validator";

@Entity()
export class Skill extends BaseEntity {

    @Column({
        unique: true
    })
    name: string;

    @Column()
    @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9\s&-]*$/)
    title: string;

    constructor(dto?: Skill | any) {
        super(dto);

        dto = dto || {} as Skill;

        this.name = dto.name;
        this.title = dto.title;
    }
}