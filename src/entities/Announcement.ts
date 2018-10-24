import { Entity, ManyToOne, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { IsNotEmpty } from "class-validator";

@Entity()
export class Announcement extends BaseEntity {

    @ManyToOne(type => User)
    author: User;

    @Column()
    @IsNotEmpty()
    content: string;

    @Column()
    isPublished: boolean;

    constructor(dto?: Announcement | any) {
        super(dto);

        dto = dto || {} as Announcement;

        this.author = dto.author ? new User(dto.author) : null;
        this.content = dto.content;
        this.isPublished = dto.isPublished;
    }
}