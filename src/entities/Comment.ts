import { Entity, ManyToOne, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { IsNotEmpty } from "class-validator";
import { TimelineUpdate } from "./TimelineUpdate";
import { TimelinePhoto } from "./TimelinePhoto";
import { Article } from "./Article";
import { Discussion } from "./Discussion";
import { Webinar } from "./Webinar";

@Entity()
export class Comment extends BaseEntity {

    @ManyToOne(type => User, {
        eager: true
    })
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
    article: Article;

    @ManyToOne(type => Discussion, discussion => discussion.comments)
    discussion: Discussion;

    @ManyToOne(type => TimelineUpdate, timelineUpdate => timelineUpdate.comments)
    timelineUpdate: TimelineUpdate;

    @ManyToOne(type => TimelinePhoto, timelinePhoto => timelinePhoto.comments)
    timelinePhoto: TimelinePhoto;

    @ManyToOne(type => Webinar, webinar => webinar.comments)
    webinar: Webinar;

    constructor(dto?: Comment | any) {
        super(dto);

        dto = dto || {} as Comment;

        this.author = dto.author ? new User(dto.author) : null;
        this.content = dto.content;
        this.parentComment = dto.parentComment ? new Comment(dto.parentComment) : null;
        this.childComments = dto.childComments ? dto.childComments.map(x => new Comment(x)) : null;
        this.article = dto.article ? new Article(dto.article) : null;
        this.discussion = dto.discussion ? new Discussion(dto.discussion) : null;
        this.timelineUpdate = dto.timelineUpdate ? new TimelineUpdate(dto.timelineUpdate) : null;
        this.timelinePhoto = dto.timelinePhoto ? new TimelinePhoto(dto.timelinePhoto) : null;
        this.webinar = dto.webinar ? new Webinar(dto.webinar) : null;
    }
}