import { Entity, Column, OneToOne, JoinColumn } from "typeorm";
import { Media } from "./Media";
import { BaseEntity } from "./BaseEntity";
import { IsNotEmpty } from "class-validator";

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
	url: string;

	@Column("int", {
		default: 0
	})
	clickCount: number;

	constructor(dto?: Ad | any) {
		super(dto);

		dto = dto || ({} as Ad);

		this.media = dto.media ? new Media(dto.media) : null;
		this.url = dto.url;
		this.clickCount = dto.clickCount;
	}
}
