import { Entity, OneToOne, ManyToOne, JoinColumn, Column, BeforeInsert, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { IsNotEmpty, IsLowercase, Length, Matches, IsDate } from "class-validator";
import { Chance } from "chance";
import { Media } from "./Media";
import { WebinarStatusEnum } from "../enums/WebinarStatusEnum";
import { Comment } from "./Comment";

@Entity()
export class Webinar extends BaseEntity {

    @ManyToOne(type => User)
    author: User;

    @OneToOne(type => User, {
        eager: true,
    })
    @IsNotEmpty()
    @JoinColumn()
    anchor: User;

    @Column("int", {
        default: 0
    })
    cpdPoints: number;

    @Column()
    @IsNotEmpty()
    topic: string;

    @Column({
        length: 1000
    })
    @Length(1000)
    description: string;

    @Column({
        length: 15
    })
    urlToken: string;

    @OneToOne(type => Media)
    @JoinColumn()
    transcript: Media;

    @Column()
    @IsDate()
    startDateTime: Date;

    @Column()
    createAnnouncement: boolean;

    @Column()
    status: WebinarStatusEnum;

    @ManyToMany(type => User, user => user.attendedWebinars, {
        eager: true
    })
    @JoinTable()
    participants: Array<User>;

    @OneToMany(type => Comment, comment => comment.webinar, {
        eager: true
    })
    comments: Array<Comment>;

    @BeforeInsert()
    generateUrlToken() {
        const chance = new Chance();
        const urlToken = chance.string({
            length: 15,
            pool: "abcdefghijklmnopqrstuvwxyz0123456789"
        });
        this.urlToken = urlToken;
    }

    constructor(dto?: Webinar | any) {
        super(dto);

        dto = dto || {} as Webinar;

        this.author = dto.author ? new User(dto.author) : null;
        this.anchor = dto.anchor ? new User(dto.anchor) : null;
        this.cpdPoints = dto.cpdPoints;
        this.topic = dto.topic;
        this.description = dto.description;
        this.urlToken = dto.urlToken;
        this.cpdPoints = dto.cpdPoints;
        this.transcript = dto.transcript ? new Media(dto.transcript) : null;
        this.startDateTime = dto.startDateTime;
        this.createAnnouncement = dto.createAnnouncement;
        this.status = dto.status;
        this.participants = dto.participants ? dto.participants.map(p => new User(p)) : null;
        this.comments = dto.comments ? dto.comments.map(c => new Comment(c)) : null;
    }
}