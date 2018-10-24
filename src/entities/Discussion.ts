import { Entity, OneToOne, ManyToOne, JoinColumn, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { IsLowercase, Matches } from "class-validator";
import { Comment } from "./Comment";

@Entity()
export class Discussion extends BaseEntity {

    @ManyToOne(type => User)
    author: User;

    @Column()
    urlToken: string;

    @Column("int", {
        default: 0
    })
    commentsCount: number;

    @OneToMany(type => Comment, comment => comment.discussion, {
        eager: true
    })
    comments: Array<Comment>;

    constructor(dto?: Discussion | any) {
        super(dto);

        dto = dto || {} as Discussion;

        this.author = dto.author ? new User(dto.author) : null;
        this.urlToken = dto.urlToken;
        this.commentsCount = dto.commentsCount;
        this.comments = dto.comments ? dto.comments.map(c => new Comment(c)) : null;
    }
}