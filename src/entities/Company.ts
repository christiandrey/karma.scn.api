import { Entity, Column, OneToOne, OneToMany, ManyToMany, JoinTable, JoinColumn, ManyToOne, BeforeInsert, BeforeUpdate } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { IsEmail, IsFQDN, IsDate, IsNotEmpty, MaxLength, IsLowercase, Matches, IsDateString, IsNumber, ArrayNotEmpty, ArrayMinSize } from "class-validator";
import { BusinessRegistrationTypeEnum } from "../enums/BusinessRegistrationTypeEnum";
import { Media } from "./Media";
import { Category } from "./Category";
import { Product } from "./Product";
import { User } from "./User";
import { Address } from "./Address";
import { IsNotWhitespace } from "../shared/decorators";

@Entity()
export class Company extends BaseEntity {
	@Column()
	@IsNotEmpty()
	name: string;

	@Column()
	urlToken: string;

	@Column({
		nullable: true
	})
	logoUrl: string;

	@OneToOne(type => Address, {
		eager: true,
		cascade: true
	})
	@JoinColumn()
	@IsNotEmpty()
	address: Address;

	@Column()
	@IsNotEmpty()
	phone: string;

	@Column({
		nullable: true
	})
	website: string;

	@Column()
	@IsEmail()
	email: string;

	@Column({
		default: true
	})
	backgroundCheck: boolean;

	@Column({
		nullable: true
	})
	noBackgroundCheckReason: string;

	@Column()
	@IsNotEmpty()
	registrationType: BusinessRegistrationTypeEnum;

	@Column({
		nullable: true
	})
	@IsNotEmpty()
	registrationNumber: string;

	@Column({
		nullable: true
	})
	@IsDateString()
	registrationDate: Date;

	@Column({
		nullable: true
	})
	@IsNumber()
	taxpayersIdentificationNumber: number;

	@Column({
		nullable: true
	})
	@IsNumber()
	vatRegistrationNumber: number;

	@Column("double")
	@IsNumber()
	averageAnnualContractValue: number;

	@Column("double")
	@IsNumber()
	highestSingularContractValue: number;

	@Column({
		length: 500
	})
	@MaxLength(500)
	productsDescription: string;

	@ManyToOne(type => Category, {
		eager: true
	})
	@IsNotEmpty()
	category: Category;

	@ManyToMany(type => Product, product => product.companies, {
		eager: true
	})
	@JoinTable()
	products: Array<Product>;

	@OneToMany(type => Media, media => media.company, {
		eager: true
	})
	// @IsNotEmpty()
	// @ArrayNotEmpty()
	// @ArrayMinSize(7)
	documents: Array<Media>;

	@OneToOne(type => User, user => user.company, {
		cascade: false
	})
	user: User;

	@Column()
	verified: boolean;

	@BeforeInsert()
	createNewUrlToken() {
		const urlToken = this.name.toLowerCase().replace(/[^a-z]/g, "");
		this.urlToken = urlToken;
	}

	@BeforeUpdate()
	updateUrlToken() {
		const urlToken = this.name.toLowerCase().replace(/[^a-z]/g, "");
		this.urlToken = urlToken;
	}

	constructor(dto?: Company | any) {
		super(dto);

		dto = dto || ({} as Company);

		this.name = dto.name;
		this.urlToken = dto.urlToken;
		this.logoUrl = dto.logoUrl;
		this.address = dto.address ? new Address(dto.address) : null;
		this.phone = dto.phone;
		this.website = dto.website;
		this.email = dto.email;
		this.backgroundCheck = dto.backgroundCheck;
		this.noBackgroundCheckReason = dto.noBackgroundCheckReason;
		this.registrationType = dto.registrationType;
		this.registrationNumber = dto.registrationNumber;
		this.registrationDate = dto.registrationDate;
		this.taxpayersIdentificationNumber = dto.taxpayersIdentificationNumber;
		this.vatRegistrationNumber = dto.vatRegistrationNumber;
		this.averageAnnualContractValue = dto.averageAnnualContractValue;
		this.highestSingularContractValue = dto.highestSingularContractValue;
		this.productsDescription = dto.productsDescription;
		this.category = dto.category ? new Category(dto.category) : null;
		this.products = dto.products ? dto.products.map(p => new Product(p)) : null;
		this.documents = dto.documents ? dto.documents.map(d => new Media(d)) : null;
		this.user = dto.user ? new User(dto.user) : null;
		this.verified = dto.verified;
	}
}
