import { Entity, ManyToOne, Column, OneToMany, AfterLoad } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { IsNotEmpty } from "class-validator";
import { Comment } from "./Comment";
import { Like } from "./Like";

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

    @Column("int")
    likesCount: number;

    @OneToMany(type => Comment, comment => comment.timelineUpdate, {
        eager: true
    })
    comments: Array<Comment>;

    @OneToMany(type => Like, like => like.timelineUpdate, {
        eager: true
    })
    likes: Array<Like>;

    @AfterLoad()
    getCommentsCount() {
        this.commentsCount = this.comments.length;
    }

    @AfterLoad()
    getLikesCount() {
        this.likesCount = this.likes.length;
    }
}