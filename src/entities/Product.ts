import { Entity, Column, ManyToMany, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Category } from "./Category";
import { IsNotEmpty, IsAlphanumeric, Matches, IsLowercase } from "class-validator";
import { Company } from "./Company";

@Entity()
export class Product extends BaseEntity {

    @Column()
    name: string;

    @Column()
    @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9\s&-]*$/)
    title: string;

    @ManyToOne(type => Category, category => category.products, {
        eager: true
    })
    category: Category;

    @ManyToMany(type => Company, company => company.products)
    companies: Array<Company>;

    constructor(dto?: Product | any) {
        super(dto);

        dto = dto || {} as Product;

        this.name = dto.name;
        this.title = dto.title;
        this.category = dto.category ? new Category(dto.category) : null;
        this.companies = dto.companies ? dto.companies.map(c => new Company(c)) : null;
    }
}