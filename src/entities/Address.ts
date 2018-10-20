import { Entity, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Length, IsNotEmpty } from "class-validator";
import { Country } from "./Country";

@Entity()
export class Address extends BaseEntity {

    @Column()
    addressLine1: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column()
    @IsNotEmpty()
    country: Country;
}