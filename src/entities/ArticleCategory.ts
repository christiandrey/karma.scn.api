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
	@Matches(/^[a-zA-Z0-9\s&-]*$/)
	title: string;

	@OneToMany(type => Article, article => article.category, {
		persistence: false
	})
	articles: Array<Article>;

	@BeforeInsert()
	createCategoryName() {
		this.name = Methods.toCamelCase(this.title.replace(/[^a-zA-Z0-9\s\s+]/g, ""));
	}

	@BeforeUpdate()
	updateCategoryName() {
		this.name = Methods.toCamelCase(this.title.replace(/[^a-zA-Z0-9\s\s+]/g, ""));
	}

	constructor(dto?: ArticleCategory | any) {
		super(dto);

		dto = dto || ({} as ArticleCategory);

		this.name = dto.name;
		this.title = dto.title;
		this.articles = dto.articles ? dto.articles.map(a => new Article(a)) : null;
	}
}
