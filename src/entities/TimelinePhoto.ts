import { Entity, ManyToOne, Column, OneToMany, AfterLoad } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { IsNotEmpty } from "class-validator";
import { Comment } from "./Comment";
import { Like } from "./Like";

@Entity()
export class TimelinePhoto extends BaseEntity {

    @ManyToOne(type => User)
    author: User;

    @Column()
    @IsNotEmpty()
    url: string;

    @Column()
    isDisabled: boolean;

    @Column("int", {
        default: 0
    })
    commentsCount: number;

    @Column("int", {
        default: 0
    })
    likesCount: number;

    @OneToMany(type => Comment, comment => comment.timelinePhoto, {
        eager: true
    })
    comments: Array<Comment>;

    @OneToMany(type => Like, like => like.timelinePhoto, {
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

    constructor(dto?: TimelinePhoto | any) {
        super(dto);

        dto = dto || {} as TimelinePhoto;

        this.author = dto.author ? new User(dto.author) : null;
        this.url = dto.url;
        this.isDisabled = dto.isDisabled;
        this.commentsCount = dto.commentsCount;
        this.likesCount = dto.likesCount;
        this.comments = dto.comments ? dto.comments.map(c => new Comment(c)) : null;
        this.likes = dto.likes ? dto.likes.map(l => new Like(l)) : null;
    }
}