import { BaseEntity } from "./BaseEntity";
import { Entity, Column } from "typeorm";
import { LogTypeEnum } from "../enums/LogTypeEnum";

@Entity()
export class Log extends BaseEntity {
	@Column()
	title: string;

	@Column({
		nullable: true,
		type: "longtext"
	})
	message: string;

	@Column()
	type: LogTypeEnum;

	constructor(dto?: Log | any) {
		super(dto);

		dto = dto || ({} as Log);

		this.title = dto.title;
		this.message = dto.message;
		this.type = dto.type;
	}
}
