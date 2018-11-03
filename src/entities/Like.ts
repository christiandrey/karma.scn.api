import { Entity, ManyToOne, OneToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { TimelineUpdate } from "./TimelineUpdate";
import { TimelinePhoto } from "./TimelinePhoto";

@Entity()
export class Like extends BaseEntity {

    @OneToOne(type => User, {
        eager: true
    })
    user: User;

    @ManyToOne(type => TimelineUpdate, timelineUpdate => timelineUpdate.likes)
    timelineUpdate: TimelineUpdate;

    @ManyToOne(type => TimelinePhoto, timelinePhoto => timelinePhoto.likes)
    timelinePhoto: TimelinePhoto;

    constructor(dto?: Like | any) {
        super(dto);

        dto = dto || {} as Like;

        this.user = dto.user ? new User(dto.user) : null;
        this.timelineUpdate = dto.timelineUpdate ? new TimelineUpdate(dto.timelineUpdate) : null;
        this.timelinePhoto = dto.timelinePhoto ? new TimelinePhoto(dto.timelinePhoto) : null;
    }
}