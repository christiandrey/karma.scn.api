import { Entity, OneToOne, ManyToOne, JoinColumn, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { MaxLength, Matches, IsLowercase } from "class-validator";
import { Media } from "./Media";
import { ArticleCategory } from "./ArticleCategory";
import { ArticleStatusEnum } from "../enums/ArticleStatusEnum";
import { Comment } from "./Comment";

@Entity()
export class Article extends BaseEntity {

    @ManyToOne(type => User, user => user.articles)
    author: User;

    @Column()
    title: string;

    @Column()
    @IsLowercase()
    @Matches(/[a-z0-9-]/g)
    urlToken: string;

    @OneToOne(type => Media, {
        eager: true,
        cascade: true
    })
    @JoinColumn()
    featuredImage: Media;

    @Column({
        length: 200
    })
    @MaxLength(200)
    synopsis: string;

    @Column()
    body: string;

    @ManyToOne(type => ArticleCategory, articleCategory => articleCategory.articles, {
        eager: true
    })
    category: ArticleCategory;

    @Column()
    isPublished: boolean;

    @Column()
    status: ArticleStatusEnum;

    @OneToMany(type => Comment, comment => comment.article, {
        eager: true
    })
    comments: Array<Comment>;
}