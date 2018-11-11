import { TimelinePost } from "../dto/classes/TimelinePost";
import { MapUser } from "./mapUser";
import { MapComment } from "./mapComment";
import { Comment } from "../entities/Comment";

export namespace MapTimelinePost {
	export function inTimelineControllerGetLatestAsync(timelinePost: TimelinePost): TimelinePost {
		const { id, urlToken, createdDate, imageUrl, author, type, content, extraContent, likesCount, comments, extraDate } = timelinePost;
		return {
			id,
			urlToken,
			createdDate,
			imageUrl,
			type,
			content,
			extraContent,
			extraDate,
			likesCount,
			author: !!author ? MapUser.inAllControllers(author) : null,
			comments: !!comments ? comments.map(x => MapComment.inAllControllers(x)) : new Array<Comment>()
		} as TimelinePost;
	}
}
