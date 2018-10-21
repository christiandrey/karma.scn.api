import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Address } from "./Address";

@Entity()
export class Country extends BaseEntity {

    @Column()
    name: string;

    @OneToMany(type => Address, address => address.country)
    addresses: Array<Address>;
}