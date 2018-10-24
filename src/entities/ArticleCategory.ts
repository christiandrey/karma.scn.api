import { Entity, OneToMany, Column, BeforeInsert, BeforeUpdate } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Article } from "./Article";
import { IsNotEmpty, IsAlphanumeric, Matches } from "class-validator";
import { Methods } from "../shared/methods";

@Entity()
export class ArticleCategory extends BaseEntity {

    @Column()
    name: string;

    @Column()
    @IsNotEmpty()
    @Matches(/[a-zA-Z0-9\s&-]/g)
    title: string;

    @OneToMany(type => Article, article => article.category)
    articles: Array<Article>;

    @BeforeInsert()
    createCategoryName() {
        this.name = Methods.toCamelCase(this.title.replace(/[^a-zA-Z0-9\s\s+]/g, ""));
    }

    @BeforeUpdate()
    updateCategoryName() {
        this.name = Methods.toCamelCase(this.title.replace(/[^a-zA-Z0-9\s\s+]/g, ""));
    }

    // constructor(dto?: ArticleCategory | any) {
    //     super();

    //     dto = dto || {} as ArticleCategory;

    //     this.name = dto.name;
    //     this.title = dto.title;
    //     this.articles = dto.articles;
    // }
}