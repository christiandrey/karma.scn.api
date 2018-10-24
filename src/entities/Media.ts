import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { MediaNameEnum } from "../enums/MediaNameEnum";
import { MediaTypeEnum } from "../enums/MediaTypeEnum";
import { User } from "./User";
import { Company } from "./Company";

@Entity()
export class Media extends BaseEntity {

    @Column()
    name: MediaNameEnum;

    @Column()
    type: MediaTypeEnum;

    @Column({
        nullable: true
    })
    url: string;

    @Column({
        nullable: true
    })
    note: string;

    @ManyToOne(type => User, user => user.certifications)
    user: User;

    @ManyToOne(type => Company, company => company.documents)
    company: Company;

    constructor(dto?: Media | any) {
        super(dto);

        dto = dto || {} as Media;

        this.name = dto.name;
        this.type = dto.type;
        this.url = dto.url;
        this.note = dto.note;
        this.user = dto.user ? new User(dto.user) : null;
        this.company = dto.company ? new Company(dto.user) : null;
    }
}