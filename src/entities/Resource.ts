import { Entity, ManyToOne, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { MaxLength, IsFQDN, IsNotEmpty } from "class-validator";

@Entity()
export class Resource extends BaseEntity {

    @ManyToOne(type => User, user => user.resources)
    user: User;

    @Column()
    isPublished: boolean;

    @Column()
    @IsNotEmpty()
    title: string;

    @Column({
        length: 500
    })
    @MaxLength(500)
    description: string;

    @Column()
    @IsFQDN()
    @IsNotEmpty()
    purchaseUrl: string;
}