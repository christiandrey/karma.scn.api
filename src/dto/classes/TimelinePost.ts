import { User } from "../../entities/User";
import { TimelinePostTypeEnum } from "../../enums/TimelinePostTypeEnum";
import { Comment } from "../../entities/Comment";

export class TimelinePost {
	id: string;
	urlToken: string;
	createdDate: Date;
	extraDate: Date;
	imageUrl: string;
	author: User;
	type: TimelinePostTypeEnum;
	content: string;
	extraContent: string;
	likesCount: number;
	comments: Array<Comment>;

	constructor(dto?: TimelinePost | any) {
		dto = dto || ({} as TimelinePost);

		this.id = dto.id;
		this.urlToken = dto.urlToken;
		this.createdDate = dto.createdDate;
		this.extraDate = dto.extraDate;
		this.imageUrl = dto.imageUrl;
		this.author = dto.author ? new User(dto.author) : null;
		this.type = dto.type;
		this.content = dto.content;
		this.extraContent = dto.extraContent;
		this.likesCount = dto.likesCount;
		this.comments = dto.comments ? dto.comments.map(c => new Comment(c)) : null;
	}
}
