import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Address } from "./Address";

@Entity()
export class Country extends BaseEntity {

    @Column()
    name: string;

    @OneToMany(type => Address, address => address.country)
    addresses: Array<Address>;

    constructor(dto?: Country | any) {
        super(dto);

        dto = dto || {} as Country;

        this.name = dto.name;
        this.addresses = dto.addresses ? dto.addresses.map(a => new Address(a)) : null;
    }
}