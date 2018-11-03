import { Entity, ManyToOne, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";

@Entity()
export class SocketRecord extends BaseEntity {

    @Column()
    socketId: string;

    @ManyToOne(type => User, user => user.socketRecords)
    user: User;

    constructor(dto?: SocketRecord | any) {
        super(dto);

        dto = dto || {} as SocketRecord;

        this.socketId = dto.socketId;
        this.user = dto.user ? new User(dto.user) : null;
    }
}