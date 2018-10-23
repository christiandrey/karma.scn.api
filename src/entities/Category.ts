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
    @Matches(/[a-zA-Z\s]/g)
    title: string;

    @OneToMany(type => Product, product => product.category)
    products: Array<Product>;

    @BeforeInsert()
    createCategoryName() {
        this.name = Methods.toCamelCase(this.title);
    }

    @BeforeUpdate()
    updateCategoryName() {
        this.name = Methods.toCamelCase(this.title);
    }
}