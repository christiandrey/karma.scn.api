import { Entity, ManyToOne, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { IsNotEmpty } from "class-validator";
import { TimelineUpdate } from "./TimelineUpdate";
import { TimelinePhoto } from "./TimelinePhoto";
import { Article } from "./Article";
import { Discussion } from "./Discussion";

@Entity()
export class Comment extends BaseEntity {

    @ManyToOne(type => User)
    author: User;

    @Column()
    @IsNotEmpty()
    content: string;

    @ManyToOne(type => Comment, comment => comment.childComments)
    parentComment: Comment;

    @OneToMany(type => Comment, comment => comment.parentComment, {
        eager: true
    })
    childComments: Array<Comment>;

    @ManyToOne(type => Article, article => article.comments)
    article: Array<Article>;

    @ManyToOne(type => Discussion, discussion => discussion.comments)
    discussion: Array<Discussion>;

    @ManyToOne(type => TimelineUpdate, timelineUpdate => timelineUpdate.comments)
    timelineUpdate: Array<TimelineUpdate>;

    @ManyToOne(type => TimelinePhoto, timelinePhoto => timelinePhoto.comments)
    timelinePhoto: Array<TimelinePhoto>;
}