import { Entity, ManyToOne, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { IsNotEmpty } from "class-validator";
import { Comment } from "./Comment";

@Entity()
export class TimelinePhoto extends BaseEntity {

    @ManyToOne(type => User)
    author: User;

    @Column()
    @IsNotEmpty()
    url: string;

    @Column()
    isDisabled: boolean;

    @Column("int")
    commentsCount: number;

    @OneToMany(type => Comment, comment => comment.timelinePhoto, {
        eager: true
    })
    comments: Array<Comment>;
}