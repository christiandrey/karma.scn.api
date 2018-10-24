import { Entity, OneToOne, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";

@Entity()
export class View extends BaseEntity {

    @ManyToOne(type => User, user => user.views)
    user: User;

    @OneToOne(type => User)
    @JoinColumn()
    viewedBy: User;

    constructor(dto?: View | any) {
        super(dto);

        dto = dto || {} as View;

        this.user = dto.user ? new User(dto.user) : null;
        this.viewedBy = dto.user ? new User(dto.viewedBy) : null;
    }
}