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

    @Column({
        nullable: true
    })
    endDate: Date;

    @Column()
    current: boolean;

    @Column({
        nullable: true
    })
    companyLogoUrl: string;

    constructor(dto?: Experience | any) {
        super(dto);

        dto = dto || {} as Experience;

        this.user = dto.user ? new User(dto.user) : null;
        this.role = dto.role;
        this.description = dto.description;
        this.organization = dto.organization;
        this.startDate = dto.startDate;
        this.endDate = dto.endDate;
        this.current = dto.current;
        this.companyLogoUrl = dto.companyLogoUrl;
    }
}