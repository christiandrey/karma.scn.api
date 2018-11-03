import { Entity, OneToOne, ManyToOne, JoinColumn, Column, BeforeInsert } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { JobTypeEnum } from "../enums/JobTypeEnum";
import { Address } from "./Address";
import { IsFQDN, IsNotEmpty, MaxLength, Matches, IsLowercase, Length } from "class-validator";
import { Chance } from "chance";

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
    organizationName: string;

    @Column({
        nullable: true
    })
    organizationLogoUrl: string;

    @Column()
    @IsNotEmpty()
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

    constructor(dto?: Job | any) {
        super(dto);

        dto = dto || {} as Job;

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