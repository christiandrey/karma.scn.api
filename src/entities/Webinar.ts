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
    @JoinColumn()
    anchor: User;

    @Column("int")
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
    @IsLowercase()
    @Length(15)
    @Matches(/[a-z0-9-]/g)
    urlToken: string;

    @BeforeInsert()
    generateUrlToken() {
        const chance = new Chance();
        const urlToken = chance.string({
            length: 15,
            pool: "abcdefghijklmnopqrstuvwxyz0123456789"
        });
        this.urlToken = urlToken;
    }

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
}