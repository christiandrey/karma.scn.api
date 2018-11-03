import { Entity, OneToOne, ManyToOne, JoinColumn, Column, OneToMany, BeforeInsert, BeforeUpdate } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { Contains, IsNotEmpty, Matches } from "class-validator";
import { Methods } from "../shared/methods";

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

    @BeforeInsert()
    createSkillName() {
        this.name = Methods.toCamelCase(this.title.replace(/[^a-zA-Z0-9\s\s+]/g, ""));
    }

    @BeforeUpdate()
    updateSkillName() {
        this.name = Methods.toCamelCase(this.title.replace(/[^a-zA-Z0-9\s\s+]/g, ""));
    }

    constructor(dto?: Skill | any) {
        super(dto);

        dto = dto || {} as Skill;

        this.name = dto.name;
        this.title = dto.title;
    }
}