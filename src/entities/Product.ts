import { Entity, Column, ManyToMany, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Category } from "./Category";
import { IsNotEmpty, IsAlphanumeric, Matches, IsLowercase } from "class-validator";
import { Company } from "./Company";

@Entity()
export class Product extends BaseEntity {

    @Column()
    @IsNotEmpty()
    @IsAlphanumeric()
    @Matches(/^[a-z]/)
    name: string;

    @Column()
    @IsNotEmpty()
    title: string;

    @ManyToOne(type => Category, category => category.products, {
        eager: true
    })
    category: Category;

    @ManyToMany(type => Company, company => company.products)
    companies: Array<Company>;
}