import { Entity, Column } from "typeorm";
import { IsNotEmpty, IsAlphanumeric } from "class-validator";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class ContentSection extends BaseEntity {
	@IsAlphanumeric()
	@Column()
	title: string;

	@Column({
		type: "longtext",
		nullable: true
	})
	content: string;

	@Column({
		type: "longtext",
		nullable: true
	})
	note: string;

	constructor(dto?: ContentSection | any) {
		super(dto);

		dto = dto || ({} as ContentSection);

		this.title = dto.title;
		this.content = dto.content;
		this.note = dto.note;
	}
}
