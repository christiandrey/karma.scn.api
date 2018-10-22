import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { IsNotEmpty } from "class-validator";
import { Country } from "./Country";

@Entity()
export class Address extends BaseEntity {

    @Column({
        nullable: true
    })
    addressLine1: string;

    @Column({
        nullable: true
    })
    addressLine2: string;

    @Column({
        nullable: true
    })
    city: string;

    @Column()
    @IsNotEmpty()
    state: string;

    @ManyToOne(type => Country, country => country.addresses, {
        eager: true
    })
    @IsNotEmpty()
    country: Country;
}