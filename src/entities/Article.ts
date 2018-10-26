import { Entity, OneToOne, ManyToOne, JoinColumn, Column, OneToMany, BeforeInsert, BeforeUpdate } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { MaxLength, Matches, IsLowercase, IsNotEmpty } from "class-validator";
import { Media } from "./Media";
import { ArticleCategory } from "./ArticleCategory";
import { ArticleStatusEnum } from "../enums/ArticleStatusEnum";
import { Comment } from "./Comment";

@Entity()
export class Article extends BaseEntity {

    @ManyToOne(type => User, user => user.articles)
    author: User;

    @Column()
    @IsNotEmpty()
    title: string;

    @Column()
    urlToken: string;

    @OneToOne(type => Media, {
        eager: true,
        cascade: ["update", "remove"]
    })
    @IsNotEmpty()
    @JoinColumn()
    featuredImage: Media;

    @Column({
        length: 200
    })
    @MaxLength(200)
    synopsis: string;

    @Column()
    @IsNotEmpty()
    body: string;

    @ManyToOne(type => ArticleCategory, articleCategory => articleCategory.articles, {
        eager: true
    })
    category: ArticleCategory;

    @Column()
    isPublished: boolean;

    @Column({
        nullable: true
    })
    publicationDate: Date;

    @Column()
    status: ArticleStatusEnum;

    @OneToMany(type => Comment, comment => comment.article, {
        eager: true
    })
    comments: Array<Comment>;

    @BeforeInsert()
    createUrlToken() {
        this.urlToken = this.title.toLowerCase().replace(/[^a-z0-9-\s+]/g, "").replace(/\s+/g, "-").replace(/\-+/g, "-");
    }

    @BeforeUpdate()
    updateUrlToken() {
        this.urlToken = this.title.toLowerCase().replace(/[^a-z0-9-\s+]/g, "").replace(/\s+/g, "-").replace(/\-+/g, "-");
    }

    constructor(dto?: Article | any) {
        super(dto);

        dto = dto || {} as Article;

        this.author = dto.author ? new User(dto.author) : null;
        this.title = dto.title;
        this.urlToken = dto.urlToken;
        this.featuredImage = dto.featuredImage ? new Media(dto.featuredImage) : null;
        this.synopsis = dto.synopsis;
        this.body = dto.body;
        this.category = dto.category ? new ArticleCategory(dto.category) : null;
        this.isPublished = dto.isPublished;
        this.publicationDate = dto.publicationDate;
        this.status = dto.status;
        this.comments = dto.comments ? dto.comments.map(c => new Comment(c)) : null;
    }
}