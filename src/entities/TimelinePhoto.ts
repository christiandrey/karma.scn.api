import { Entity, ManyToOne, Column, OneToMany, AfterLoad, OneToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { IsNotEmpty } from "class-validator";
import { Comment } from "./Comment";
import { Like } from "./Like";
import { Media } from "./Media";

@Entity()
export class TimelinePhoto extends BaseEntity {

    @ManyToOne(type => User)
    author: User;

    @OneToOne(type => Media, {
        eager: true,
        cascade: true
    })
    @JoinColumn()
    @IsNotEmpty()
    media: Media;

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
        this.commentsCount = !!this.comments ? this.comments.length : 0;
    }

    @AfterLoad()
    getLikesCount() {
        this.likesCount = !!this.likes ? this.likes.length : 0;
    }

    constructor(dto?: TimelinePhoto | any) {
        super(dto);

        dto = dto || {} as TimelinePhoto;

        this.author = dto.author ? new User(dto.author) : null;
        this.media = dto.media ? new Media(dto.media) : null;
        this.isDisabled = dto.isDisabled;
        this.commentsCount = dto.commentsCount;
        this.likesCount = dto.likesCount;
        this.comments = dto.comments ? dto.comments.map(c => new Comment(c)) : null;
        this.likes = dto.likes ? dto.likes.map(l => new Like(l)) : null;
    }
}