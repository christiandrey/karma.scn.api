import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { IsNotEmpty, IsAlphanumeric, Matches } from "class-validator";
import { Product } from "./Product";

@Entity()
export class Category extends BaseEntity {

    @Column()
    @IsNotEmpty()
    @IsAlphanumeric()
    @Matches(/^[a-z]/)
    name: string;

    @Column()
    @IsNotEmpty()
    title: string;

    @OneToMany(type => Product, product => product.category)
    products: Array<Product>;
}