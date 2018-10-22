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
    note: string;

    @ManyToOne(type => User, user => user.certifications)
    user: User;

    @ManyToOne(type => Company, company => company.documents)
    company: Company;
}