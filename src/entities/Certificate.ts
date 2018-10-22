import { Entity, OneToOne, ManyToOne, JoinColumn, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { IsAlphanumeric, IsFQDN } from "class-validator";
import { Media } from "./Media";

@Entity()
export class Certificate extends BaseEntity {

    @ManyToOne(type => User, user => user.certifications)
    user: User;

    @Column()
    issuer: string;

    @Column()
    @IsAlphanumeric()
    certificateNumber: string;

    @Column()
    dateOfIssue: Date;

    @OneToOne(type => Media)
    @JoinColumn()
    media: Media;

    @Column()
    @IsFQDN()
    issuerLogoUrl: string;
}