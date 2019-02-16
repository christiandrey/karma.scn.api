import { Entity, ManyToOne, Column, BeforeInsert, BeforeUpdate } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { MaxLength, IsFQDN, IsNotEmpty } from "class-validator";
import { Methods } from "../shared/methods";

@Entity()
export class Resource extends BaseEntity {
	@ManyToOne(type => User, user => user.resources, {
		eager: true
	})
	user: User;

	@Column()
	isPublished: boolean;

	@Column({
		nullable: true
	})
	publicationDate: Date;

	@Column()
	@IsNotEmpty()
	title: string;

	@Column({
		length: 500,
		nullable: true
	})
	@MaxLength(500)
	description: string;

	@Column()
	@IsNotEmpty()
	purchaseUrl: string;

	@BeforeInsert()
	sanitizeUrlBeforeInsert() {
		const sanitizedUrl = Methods.sanitizeURL(this.purchaseUrl);
		this.purchaseUrl = sanitizedUrl;
	}

	@BeforeUpdate()
	sanitizeUrlBeforeUpdate() {
		const sanitizedUrl = Methods.sanitizeURL(this.purchaseUrl);
		this.purchaseUrl = sanitizedUrl;
	}

	constructor(dto?: Resource | any) {
		super(dto);

		dto = dto || ({} as Resource);

		this.user = dto.user ? new User(dto.user) : null;
		this.publicationDate = dto.publicationDate;
		this.isPublished = dto.isPublished;
		this.title = dto.title;
		this.description = dto.description;
		this.purchaseUrl = dto.purchaseUrl;
	}
}
