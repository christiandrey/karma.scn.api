import { Entity, OneToOne, ManyToOne, JoinColumn, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { ConnectionStatusEnum } from "../enums/ConnectionStatusEnum";
import { IsNotEmpty } from "class-validator";

@Entity()
export class Connection extends BaseEntity {

    @ManyToOne(type => User, user => user.connections)
    user: User;

    @OneToOne(type => User, {
        eager: true,
    })
    @JoinColumn()
    @IsNotEmpty()
    connectedTo: User;

    @Column()
    status: ConnectionStatusEnum;

    constructor(dto?: Connection | any) {
        super(dto);

        dto = dto || {} as Connection;

        this.user = dto.user ? new User(dto.user) : null;
        this.connectedTo = dto.connectedTo ? new User(dto.connectedTo) : null;
        this.status = dto.status;
    }
}