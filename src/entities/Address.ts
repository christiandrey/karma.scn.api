import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { IsNotEmpty } from "class-validator";
import { Country } from "./Country";

@Entity()
export class Address extends BaseEntity {

    @Column()
    addressLine1: string;

    @Column()
    addressLine2: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @ManyToOne(type => Country, country => country.addresses, {
        eager: true
    })
    @IsNotEmpty()
    country: Country;
}