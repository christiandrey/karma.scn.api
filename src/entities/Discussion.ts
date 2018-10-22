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
    @IsLowercase()
    @Matches(/[a-z0-9-]/g)
    urlToken: string;

    @Column("int", {
        default: 0
    })
    commentsCount: number;

    @OneToMany(type => Comment, comment => comment.discussion, {
        eager: true
    })
    comments: Array<Comment>;
}