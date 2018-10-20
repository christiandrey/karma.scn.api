import { Entity, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Country extends BaseEntity {

    @Column()
    name: string;
}