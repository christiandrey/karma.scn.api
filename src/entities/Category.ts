import { Entity, Column, OneToMany, BeforeInsert, BeforeUpdate } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { IsNotEmpty, Matches } from "class-validator";
import { Product } from "./Product";
import { Methods } from "../shared/methods";

@Entity()
export class Category extends BaseEntity {
	@Column()
	name: string;

	@Column()
	@IsNotEmpty()
	@Matches(/^[a-zA-Z0-9\s&-]*$/)
	title: string;

	@OneToMany(type => Product, product => product.category, {
		persistence: false,
		cascade: ["remove"]
	})
	products: Array<Product>;

	@BeforeInsert()
	createCategoryName() {
		this.name = Methods.toCamelCase(this.title.replace(/[^a-zA-Z0-9\s\s+]/g, ""));
	}

	@BeforeUpdate()
	updateCategoryName() {
		this.name = Methods.toCamelCase(this.title.replace(/[^a-zA-Z0-9\s\s+]/g, ""));
	}

	constructor(dto?: Category | any) {
		super(dto);

		dto = dto || ({} as Category);

		this.name = dto.name;
		this.title = dto.title;
		this.products = dto.products ? dto.products.map(p => new Product(p)) : null;
	}
}
