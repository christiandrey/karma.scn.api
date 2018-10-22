import { User } from "../../entities/User";
import { TimelinePostTypeEnum } from "../../enums/TimelinePostTypeEnum";
import { Like } from "../../entities/Like";
import { Comment } from "../../entities/Comment";

export class TimelinePost {
    id: string;
    urlToken: string;
    createdDate: Date;
    modifiedDate: Date;
    author: User;
    type: TimelinePostTypeEnum;
    content: string;
    likes: Array<Like>;
    comments: Array<Comment>;
}