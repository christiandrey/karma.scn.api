import { Entity, Column, OneToOne, JoinColumn, ManyToMany, OneToMany, ManyToOne, AfterLoad, BeforeInsert, BeforeUpdate } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { UserTypeEnum } from "../enums/UserTypeEnum";
import { IsEmail, MinLength, IsFQDN, MaxLength, IsLowercase, Matches, IsAlpha, IsNotEmpty } from "class-validator";
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

    @Column({
        nullable: true
    })
    dateOfBirth: Date;

    @OneToOne(type => Address, {
        eager: true
    })
    @JoinColumn()
    address?: Address;

    @OneToOne(type => Experience)
    @JoinColumn()
    latestExperience: Experience;

    @Column()
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

    @Column("int", {
        default: 0
    })
    cpdPoints: number;

    @OneToMany(type => Connection, connection => connection.user)
    connections: Array<Connection>;

    @Column({
        length: 500,
        nullable: true
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
        const urlToken = `${this.firstName.toLowerCase()}${this.lastName.toLowerCase()}${Math.abs(Methods.hash(email))}`;
        this.urlToken = urlToken;
    }

    @BeforeUpdate()
    updateUrlToken() {
        const email = this.email.toLowerCase().replace(/[^a-z0-9]/g, "");
        const urlToken = `${this.firstName.toLowerCase()}${this.lastName.toLowerCase()}${Math.abs(Methods.hash(email))}`;
        this.urlToken = urlToken;
    }

    @AfterLoad()
    getLatestExperience() {
        const experiences = this.experiences;

        if (!!experiences && experiences.length > 0) {
            this.latestExperience = experiences[0];
        }
    }

    constructor(dto?: User | any) {
        super(dto);

        dto = dto || {} as User;

        this.type = dto.type;
        this.firstName = dto.firstName;
        this.lastName = dto.lastName;
        this.dateOfBirth = dto.dateOfBirth;
        this.address = dto.address ? new Address(dto.address) : null;
        this.latestExperience = dto.latestExperience ? new Experience(dto.latestExperience) : null;
        this.urlToken = dto.urlToken;
        this.phone = dto.phone;
        this.email = dto.email;
        this.password = dto.password;
        this.profilePhoto = dto.profilePhoto ? new Media(dto.profilePhoto) : null;
        this.company = dto.company ? new Company(dto.company) : null;
        this.certifications = dto.certifications ? dto.certifications.map(c => new Certificate(c)) : null;
        this.facebookUrl = dto.facebookUrl;
        this.linkedInUrl = dto.linkedInUrl;
        this.googlePlusUrl = dto.googlePlusUrl;
        this.twitterUrl = dto.twitterUrl;
        this.cpdPoints = dto.cpdPoints;
        this.connections = dto.connections ? dto.connections.map(c => new Connection(c)) : null;
        this.description = dto.description;
        this.experiences = dto.experiences ? dto.experiences.map(e => new Experience(e)) : null;
        this.skills = dto.skills ? dto.skills.map(s => new Skill(s)) : null;
        this.articles = dto.articles ? dto.articles.map(a => new Article(a)) : null;
        this.resources = dto.resources ? dto.resources.map(r => new Resource(r)) : null;
        this.views = dto.views ? dto.views.map(v => new View(v)) : null;
        this.notifications = dto.notifications ? dto.notifications.map(n => new Notification(n)) : null;
        this.attendedWebinars = dto.attendedWebinars ? dto.attendedWebinars.map(a => new Webinar(a)) : null;
    }
}