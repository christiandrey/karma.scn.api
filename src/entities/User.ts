import { Entity, Column, OneToOne, JoinColumn, ManyToMany, OneToMany, ManyToOne, AfterLoad, BeforeInsert, BeforeUpdate } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { UserTypeEnum } from "../enums/UserTypeEnum";
import { IsEmail, MinLength, IsFQDN, MaxLength, IsLowercase, Matches, IsAlpha } from "class-validator";
import { Company } from "./Company";
import { Media } from "./Media";
import { View } from "./View";
import { Connection } from "./Connection";
import { Experience } from "./Experience";
import { Skill } from "./Skill";
import { Article } from "./Article";
import { Resource } from "./Resource";
import { Certificate } from "./Certificate";
import { Notification } from "./Notification";
import { Webinar } from "./Webinar";
import { Address } from "./Address";
import { Chance } from "chance";
import { Methods } from "../shared/methods";

@Entity()
export class User extends BaseEntity {

    @Column()
    type: UserTypeEnum;

    @Column()
    @IsAlpha()
    firstName: string;

    @Column()
    @IsAlpha()
    lastName: string;

    @OneToOne(type => Address)
    @JoinColumn()
    address?: Address;

    @OneToOne(type => Experience)
    @JoinColumn()
    latestExperience: Experience;

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
    company?: Company;

    @OneToMany(type => Certificate, certificate => certificate.user, {
        eager: true,
        cascade: true
    })
    certifications: Array<Certificate>;

    @Column({
        nullable: true
    })
    @IsFQDN()
    facebookUrl: string;

    @Column({
        nullable: true
    })
    @IsFQDN()
    linkedInUrl: string;

    @Column({
        nullable: true
    })
    @IsFQDN()
    googlePlusUrl: string;

    @Column({
        nullable: true
    })
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

    @OneToMany(type => Experience, experience => experience.user, {
        eager: true
    })
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

    @OneToMany(type => Notification, notification => notification.user)
    notifications: Array<Notification>;

    @ManyToMany(type => Webinar, webinar => webinar.participants)
    attendedWebinars: Array<Webinar>;

    @BeforeInsert()
    createNewUrlToken() {
        const email = this.email.toLowerCase().replace(/[^a-z0-9]/g, "");
        const urlToken = `${this.firstName.toLowerCase()}${this.lastName.toLowerCase()}${Methods.hash(email)}`;
        this.urlToken = urlToken;
    }

    @BeforeUpdate()
    updateUrlToken() {
        const email = this.email.toLowerCase().replace(/[^a-z0-9]/g, "");
        const urlToken = `${this.firstName.toLowerCase()}${this.lastName.toLowerCase()}${Methods.hash(email)}`;
        this.urlToken = urlToken;
    }

    @AfterLoad()
    getLatestExperience() {
        const experiences = this.experiences;

        if (experiences.length > 0) {
            this.latestExperience = experiences[0];
        }
    }
}