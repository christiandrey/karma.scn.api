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
	@IsNotEmpty()
	city: string;

	@Column()
	@IsNotEmpty()
	state: string;

	@ManyToOne(type => Country, country => country.addresses, {
		eager: true
	})
	@IsNotEmpty()
	country: Country;

	constructor(dto?: Address | any) {
		super(dto);

		dto = dto || ({} as Address);

		this.addressLine1 = dto.addressLine1;
		this.addressLine2 = dto.addressLine2;
		this.city = dto.city;
		this.state = dto.state;
		this.country = dto.country ? new Country(dto.country) : null;
	}
}
