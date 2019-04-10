import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { IsNotEmpty, IsUrl } from "class-validator";

import { BaseEntity } from "./BaseEntity";
import { Media } from "./Media";
import { Methods } from "../shared/methods";

@Entity()
export class Ad extends BaseEntity {
	@OneToOne(type => Media, {
		eager: true,
		cascade: true
	})
	@JoinColumn()
	@IsNotEmpty()
	media: Media;

	@Column({
		nullable: true
	})
	@IsNotEmpty()
	@IsUrl()
	url: string;

	@Column("int", {
		default: 0
	})
	clickCount: number;

	@BeforeInsert()
	sanitizeUrlBeforeInsert() {
		const sanitizedUrl = Methods.sanitizeURL(this.url);
		this.url = sanitizedUrl;
	}

	@BeforeInsert()
	sanitizeUrlBeforeUpdate() {
		const sanitizedUrl = Methods.sanitizeURL(this.url);
		this.url = sanitizedUrl;
	}

	constructor(dto?: Ad | any) {
		super(dto);

		dto = dto || ({} as Ad);

		this.media = dto.media ? new Media(dto.media) : null;
		this.url = dto.url;
		this.clickCount = dto.clickCount;
	}
}
