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

	@Column({
		type: "longtext"
	})
	@IsNotEmpty()
	content: string;

	@Column({
		default: false
	})
	isDisabled: boolean;

	@Column("int", {
		default: 0
	})
	commentsCount: number;

	@Column("int", {
		default: 0
	})
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
		this.commentsCount = !!this.comments ? this.comments.length : 0;
	}

	@AfterLoad()
	getLikesCount() {
		this.likesCount = !!this.likes ? this.likes.length : 0;
	}

	constructor(dto?: TimelineUpdate | any) {
		super(dto);

		dto = dto || ({} as TimelineUpdate);

		this.author = dto.author ? new User(dto.author) : null;
		this.content = dto.content;
		this.isDisabled = dto.isDisabled;
		this.commentsCount = dto.commentsCount;
		this.likesCount = dto.likesCount;
		this.comments = dto.comments ? dto.comments.map(c => new Comment(c)) : null;
		this.likes = dto.likes ? dto.likes.map(l => new Like(l)) : null;
	}
}
