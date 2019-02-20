import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { IsFQDN, IsLowercase, IsNotEmpty, IsUrl, Length, Matches, MaxLength } from "class-validator";

import { Address } from "./Address";
import { BaseEntity } from "./BaseEntity";
import { Chance } from "chance";
import { JobTypeEnum } from "../enums/JobTypeEnum";
import { Methods } from "../shared/methods";
import { User } from "./User";

@Entity()
export class Job extends BaseEntity {
	@ManyToOne(type => User, {
		eager: true
	})
	author: User;

	@Column({
		length: 15
	})
	urlToken: string;

	@Column()
	isPublished: boolean;

	@Column({
		nullable: true
	})
	publicationDate: Date;

	@Column()
	@IsNotEmpty()
	title: string;

	@Column()
	type: JobTypeEnum;

	@OneToOne(type => Address, {
		eager: true,
		cascade: true
	})
	@JoinColumn()
	address: Address;

	@Column()
	@IsNotEmpty()
	organizationName: string;

	@Column({
		nullable: true
	})
	organizationLogoUrl: string;

	@Column()
	@IsNotEmpty()
	@IsUrl()
	applicationUrl: string;

	@Column({
		length: 1000
	})
	@MaxLength(1000)
	description: string;

	@Column({
		length: 1000
	})
	@MaxLength(1000)
	roles: string;

	@Column({
		length: 1000
	})
	@MaxLength(1000)
	requirements: string;

	@Column("int", {
		default: 0
	})
	viewCount: number;

	@BeforeInsert()
	generateUrlToken() {
		const chance = new Chance();
		const urlToken = chance.string({
			length: 15,
			pool: "abcdefghijklmnopqrstuvwxyz0123456789"
		});
		this.urlToken = urlToken;
	}

	@BeforeInsert()
	sanitizeUrlBeforeInsert() {
		const sanitizedUrl = Methods.sanitizeURL(this.applicationUrl);
		this.applicationUrl = sanitizedUrl;
	}

	@BeforeUpdate()
	sanitizeUrlBeforeUpdate() {
		const sanitizedUrl = Methods.sanitizeURL(this.applicationUrl);
		this.applicationUrl = sanitizedUrl;
	}

	constructor(dto?: Job | any) {
		super(dto);

		dto = dto || ({} as Job);

		this.author = dto.author ? new User(dto.author) : null;
		this.urlToken = dto.urlToken;
		this.title = dto.title;
		this.type = dto.type;
		this.isPublished = dto.isPublished;
		this.publicationDate = dto.publicationDate;
		this.address = dto.address ? new Address(dto.address) : null;
		this.organizationName = dto.organizationName;
		this.organizationLogoUrl = dto.organizationLogoUrl;
		this.applicationUrl = dto.applicationUrl;
		this.description = dto.description;
		this.roles = dto.roles;
		this.requirements = dto.requirements;
		this.viewCount = dto.viewCount;
	}
}
