import { Entity, ManyToOne, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { IsNotEmpty } from "class-validator";
import { NotificationTypeEnum } from "../enums/NotificationTypeEnum";

@Entity()
export class Notification extends BaseEntity {

    @ManyToOne(type => User, user => user.notifications, {
        eager: true
    })
    user: User;

    @Column()
    @IsNotEmpty()
    content: string;

    @Column()
    type: NotificationTypeEnum;

    @Column({
        nullable: true
    })
    data: string;

    @Column()
    hasBeenRead: boolean;

    constructor(dto?: Notification | any) {
        super(dto);

        dto = dto || {} as Notification;

        this.user = dto.user ? new User(dto.user) : null;
        this.content = dto.content;
        this.type = dto.type;
        this.data = dto.data;
        this.hasBeenRead = dto.hasBeenRead;
    }
}