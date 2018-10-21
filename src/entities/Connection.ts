import { Entity, OneToOne, ManyToOne, JoinColumn, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { ConnectionStatusEnum } from "../enums/ConnectionStatusEnum";

@Entity()
export class Connection extends BaseEntity {

    @ManyToOne(type => User, user => user.connections)
    user: User;

    @OneToOne(type => User, {
        eager: true,
    })
    @JoinColumn()
    connectedTo: User;

    @Column()
    status: ConnectionStatusEnum;
}