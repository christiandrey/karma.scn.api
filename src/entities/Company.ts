import { Entity, Column, OneToOne, OneToMany, ManyToMany, JoinTable, JoinColumn, ManyToOne, BeforeInsert, BeforeUpdate } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { IsEmail, IsFQDN, IsDate, IsNotEmpty, MaxLength, IsLowercase, Matches } from "class-validator";
import { BusinessRegistrationTypeEnum } from "../enums/BusinessRegistrationTypeEnum";
import { Media } from "./Media";
import { Category } from "./Category";
import { Product } from "./Product";
import { User } from "./User";
import { Address } from "./Address";

@Entity()
export class Company extends BaseEntity {

    @Column()
    name: string;

    @Column()
    @IsLowercase()
    @Matches(/[a-z0-9-]/g)
    urlToken: string;

    @Column({
        nullable: true
    })
    logoUrl: string;

    @Column({
        nullable: true
    })
    postalBox: number;

    @OneToOne(type => Address, {
        eager: true,
        cascade: true
    })
    @JoinColumn()
    address: Address;

    @Column()
    phone: string;

    @Column({
        nullable: true
    })
    @IsFQDN()
    website: string;

    @Column()
    @IsEmail()
    email: string;

    @Column()
    backgroundCheck: boolean;

    @Column({
        nullable: true
    })
    noBackgroundCheckReason: string;

    @Column()
    registrationType: BusinessRegistrationTypeEnum;

    @Column()
    @IsNotEmpty()
    registrationNumber: string;

    @Column()
    @IsDate()
    registrationDate: Date;

    @Column({
        nullable: true
    })
    taxpayersIdentificationNumber: number;

    @Column({
        nullable: true
    })
    vatRegistrationNumber: number;

    @Column("double")
    averageAnnualContractValue: number;

    @Column("double")
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
        eager: true,
        cascade: true
    })
    documents: Array<Media>;

    @OneToOne(type => User, user => user.company)
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
}