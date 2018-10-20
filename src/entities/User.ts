import { Entity, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { UserTypeEnum } from "../enums/UserTypeEnum";
import { IsEmail, MinLength } from "class-validator";

@Entity()
export class User extends BaseEntity {

    @Column()
    type: UserTypeEnum;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    phone: string;

    @Column()
    @IsEmail()
    email: string;

    @Column()
    @MinLength(10, {
        message: "Password is too short"
    })
    password: string;

}