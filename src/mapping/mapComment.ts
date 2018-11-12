import { Comment } from "../entities/Comment";
import { Media } from "../entities/Media";
import { User } from "../entities/User";

export namespace MapComment {
	export function inAllControllers(comment: Comment): Comment {
		return {
			id: comment.id,
			createdDate: comment.createdDate,
			author: {
				id: comment.author.id,
				urlToken: comment.author.urlToken,
				firstName: comment.author.firstName,
				lastName: comment.author.lastName,
				profilePhoto: !!comment.author.profilePhoto
					? ({
							id: comment.author.profilePhoto.id,
							url: comment.author.profilePhoto.id
					  } as Media)
					: null,
				latestExperience:
					!!comment.author.latestExperience && comment.author.latestExperience.current
						? {
								role: comment.author.latestExperience.role,
								organization: comment.author.latestExperience.organization
						  }
						: null
			} as User,
			content: comment.content,
			childComments: !!comment.childComments ? comment.childComments.map(c => inAllControllers(c)) : new Array<Comment>()
		} as Comment;
	}
}
