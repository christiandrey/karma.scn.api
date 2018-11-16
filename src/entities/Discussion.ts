import { Entity, ManyToOne, Column, OneToMany, BeforeInsert, AfterLoad } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { Comment } from "./Comment";
import { Chance } from "chance";
import { MaxLength, IsNotEmpty } from "class-validator";

@Entity()
export class Discussion extends BaseEntity {
	@ManyToOne(type => User, {
		eager: true
	})
	author: User;

	@Column()
	@IsNotEmpty()
	topic: string;

	@Column({
		length: 1000
	})
	@MaxLength(1000)
	description: string;

	@Column()
	urlToken: string;

	@Column("int", {
		default: 0
	})
	commentsCount: number;

	@OneToMany(type => Comment, comment => comment.discussion)
	comments: Array<Comment>;

	@BeforeInsert()
	generateUrlToken() {
		const chance = new Chance();
		const urlToken = chance.string({
			length: 15,
			pool: "abcdefghijklmnopqrstuvwxyz0123456789"
		});
		this.urlToken = urlToken;
	}

	@AfterLoad()
	getCommentsCount() {
		this.commentsCount = !!this.comments ? this.comments.length : 0;
	}

	constructor(dto?: Discussion | any) {
		super(dto);

		dto = dto || ({} as Discussion);

		this.author = dto.author ? new User(dto.author) : null;
		this.topic = dto.topic;
		this.description = dto.description;
		this.urlToken = dto.urlToken;
		this.commentsCount = dto.commentsCount;
		this.comments = dto.comments ? dto.comments.map(c => new Comment(c)) : null;
	}
}
