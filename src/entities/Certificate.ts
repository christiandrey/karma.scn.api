import { Entity, OneToOne, ManyToOne, JoinColumn, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { IsAlphanumeric, IsFQDN, IsNotEmpty } from "class-validator";
import { Media } from "./Media";

@Entity()
export class Certificate extends BaseEntity {

    @ManyToOne(type => User, user => user.certifications)
    user: User;

    @Column()
    @IsNotEmpty()
    issuer: string;

    @Column()
    @IsAlphanumeric()
    @IsNotEmpty()
    certificateNumber: string;

    @Column()
    @IsNotEmpty()
    dateOfIssue: Date;

    @OneToOne(type => Media)
    @JoinColumn()
    media: Media;

    @Column({
        nullable: true
    })
    issuerLogoUrl: string;

    constructor(dto?: Certificate | any) {
        super(dto);

        dto = dto || {} as Certificate;

        this.user = dto.user ? new User(dto.user) : null;
        this.issuer = dto.issuer;
        this.certificateNumber = dto.certificateNumber;
        this.dateOfIssue = dto.dateOfIssue;
        this.media = dto.media ? new Media(dto.media) : null;
        this.issuerLogoUrl = dto.issuerLogoUrl;
    }
}