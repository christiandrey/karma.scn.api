import { User } from "../../entities/User";
import { TimelinePostTypeEnum } from "../../enums/TimelinePostTypeEnum";
import { Comment } from "../../entities/Comment";
import { Like } from "../../entities/Like";

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
	likes: Array<Like>;
	comments: Array<Comment>;
	status: string;

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
		this.likes = dto.likes ? dto.likes.map(l => new Like(l)) : null;
		this.comments = dto.comments ? dto.comments.map(c => new Comment(c)) : null;
		this.status = dto.status;
	}
}
