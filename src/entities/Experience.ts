import { Entity, ManyToOne, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { IsDate, MaxLength } from "class-validator";

@Entity()
export class Experience extends BaseEntity {

    @ManyToOne(type => User, user => user.experiences)
    user: User;

    @Column()
    role: string;

    @Column()
    @MaxLength(500)
    description: string;

    @Column()
    organization: string;

    @Column()
    @IsDate()
    startDate: Date;

    @Column()
    endDate: Date;

    @Column()
    current: boolean;

    @Column()
    companyLogoUrl: string;
}