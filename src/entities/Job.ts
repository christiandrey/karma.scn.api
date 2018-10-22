import { Entity, OneToOne, ManyToOne, JoinColumn, Column, BeforeInsert } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { JobTypeEnum } from "../enums/JobTypeEnum";
import { Address } from "./Address";
import { IsFQDN, IsNotEmpty, MaxLength, Matches, IsLowercase, Length } from "class-validator";
import { Chance } from "chance";

@Entity()
export class Job extends BaseEntity {

    @ManyToOne(type => User)
    author: User;

    @Column({
        length: 15
    })
    @IsLowercase()
    @Length(15)
    @Matches(/[a-z0-9-]/g)
    urlToken: string;

    @Column()
    isPublished: boolean;

    @Column()
    @IsNotEmpty()
    title: string;

    @Column()
    type: JobTypeEnum;

    @OneToOne(type => Address)
    @JoinColumn()
    address: Address;

    @Column()
    organizationName: string;

    @Column()
    @IsFQDN()
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

    @Column("int")
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
}