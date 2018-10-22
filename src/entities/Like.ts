import { Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { TimelineUpdate } from "./TimelineUpdate";
import { TimelinePhoto } from "./TimelinePhoto";

@Entity()
export class Like extends BaseEntity {

    @ManyToOne(type => User, user => user.views)
    user: User;

    @ManyToOne(type => TimelineUpdate, timelineUpdate => timelineUpdate.likes)
    timelineUpdate: Array<TimelineUpdate>;

    @ManyToOne(type => TimelinePhoto, timelinePhoto => timelinePhoto.likes)
    timelinePhoto: Array<TimelinePhoto>;
}