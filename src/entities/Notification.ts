import { Entity, OneToOne, ManyToOne, JoinColumn, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { IsNotEmpty } from "class-validator";

@Entity()
export class Notification extends BaseEntity {

    @ManyToOne(type => User, user => user.notifications)
    user: User;

    @Column()
    @IsNotEmpty()
    content: string;
}