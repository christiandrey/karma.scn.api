import { Entity, OneToMany, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Article } from "./Article";
import { IsNotEmpty, IsAlphanumeric, Matches } from "class-validator";

@Entity()
export class ArticleCategory extends BaseEntity {

    @Column()
    @IsNotEmpty()
    @IsAlphanumeric()
    @Matches(/^[a-z]/)
    name: string;

    @Column()
    @IsNotEmpty()
    title: string;

    @OneToMany(type => Article, article => article.category)
    articles: Array<Article>;
}