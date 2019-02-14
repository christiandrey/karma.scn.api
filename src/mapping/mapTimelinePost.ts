import { TimelinePost } from "../dto/classes/TimelinePost";
import { MapUser } from "./mapUser";
import { MapComment } from "./mapComment";
import { Comment } from "../entities/Comment";
import { MapLike } from "./mapLike";
import { Like } from "../entities/Like";

export namespace MapTimelinePost {
	export function inTimelineControllerGetLatestAsync(timelinePost: TimelinePost): TimelinePost {
		const { id, urlToken, createdDate, imageUrl, author, type, content, extraContent, likes, comments, extraDate, status } = timelinePost;
		return {
			id,
			urlToken,
			createdDate,
			imageUrl,
			type,
			content,
			extraContent,
			extraDate,
			status,
			author: !!author ? MapUser.inAllControllers(author) : null,
			likes: !!likes ? likes.map(x => MapLike.inTimelineController(x)) : new Array<Like>(),
			comments: !!comments ? comments.map(x => MapComment.inAllControllers(x)) : new Array<Comment>()
		} as TimelinePost;
	}
}
