import { Comment } from "../entities/Comment";
import { Media } from "../entities/Media";
import { User } from "../entities/User";
import { Company } from "../entities/Company";
import { MapCompany } from "./mapCompany";
import { Discussion } from "../entities/Discussion";
import { Webinar } from "../entities/Webinar";

export namespace MapComment {
	export function inAllControllers(comment: Comment): Comment {
		return {
			id: comment.id,
			createdDate: comment.createdDate,
			author: {
				id: comment.author.id,
				company: !!comment.author.company ? MapCompany.inMapCommentInAllControllers(comment.author.company) : null,
				type: comment.author.type,
				urlToken: comment.author.urlToken,
				firstName: comment.author.firstName,
				lastName: comment.author.lastName,
				profilePhoto: !!comment.author.profilePhoto
					? ({
							id: comment.author.profilePhoto.id,
							url: comment.author.profilePhoto.url
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
			discussion: !!comment.discussion ? new Discussion({ id: comment.discussion.id }) : null,
			webinar: !!comment.webinar ? new Webinar({ id: comment.webinar.id }) : null,
			content: comment.content,
			childComments: !!comment.childComments ? comment.childComments.map(c => inAllControllers(c)) : new Array<Comment>()
		} as Comment;
	}
}
