import { Entity, ManyToOne, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { IsNotEmpty } from "class-validator";
import { Comment } from "./Comment";

@Entity()
export class TimelineUpdate extends BaseEntity {

    @ManyToOne(type => User)
    author: User;

    @Column()
    @IsNotEmpty()
    content: string;

    @Column()
    isDisabled: boolean;

    @Column("int")
    commentsCount: number;

    @OneToMany(type => Comment, comment => comment.timelineUpdate, {
        eager: true
    })
    comments: Array<Comment>;
}