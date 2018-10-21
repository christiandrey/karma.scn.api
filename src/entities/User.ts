import { Entity, Column, OneToOne, JoinColumn, ManyToMany, JoinTable, OneToMany, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { UserTypeEnum } from "../enums/UserTypeEnum";
import { IsEmail, MinLength, IsFQDN, MaxLength, IsLowercase, Matches } from "class-validator";
import { Company } from "./Company";
import { Media } from "./Media";
import { View } from "./View";
import { Connection } from "./Connection";
import { Experience } from "./Experience";
import { Skill } from "./Skill";
import { Article } from "./Article";
import { Resource } from "./Resource";

@Entity()
export class User extends BaseEntity {

    @Column()
    type: UserTypeEnum;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    @IsLowercase()
    @Matches(/[a-z0-9-]/g)
    urlToken: string;

    @Column()
    phone: string;

    @Column({
        unique: true
    })
    @IsEmail()
    email: string;

    @Column()
    @MinLength(3, {
        message: "Password has to be a minimum of 3 characters"
    })
    password: string;

    @OneToOne(type => Media, {
        eager: true,
        cascade: true
    })
    @JoinColumn()
    profilePhoto: Media;

    @OneToOne(type => Company, company => company.user, {
        eager: true,
        cascade: ["remove"]
    })
    @JoinColumn()
    company: Company;

    @OneToMany(type => Media, media => media.user, {
        eager: true,
        cascade: true
    })
    certifications: Array<Media>; //TODO Change to New Entity

    @Column()
    @IsFQDN()
    facebookUrl: string;

    @Column()
    @IsFQDN()
    linkedInUrl: string;

    @Column()
    @IsFQDN()
    googlePlusUrl: string;

    @Column()
    @IsFQDN()
    twitterUrl: string;

    @Column("int")
    cpdPoints: number;

    @OneToMany(type => Connection, connection => connection.user)
    connections: Array<Connection>;

    @Column({
        length: 500
    })
    @MaxLength(500)
    description: string;

    @OneToMany(type => Experience, experience => experience.user)
    experiences: Array<Experience>;

    @ManyToOne(type => Skill, {
        eager: true
    })
    skills: Array<Skill>;

    @OneToMany(type => Article, article => article.author)
    articles: Array<Article>;

    @OneToMany(type => Resource, resource => resource.user)
    resources: Array<Resource>;

    @OneToMany(type => View, view => view.user, {
        eager: true
    })
    views: Array<View>;
}