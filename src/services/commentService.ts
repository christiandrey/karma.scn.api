import { getRepository } from "typeorm";
import { Comment } from "../entities/Comment";
import { IJsonResponse } from "../interfaces/IJsonResponse";
import { validate } from "class-validator";
import { FormResponse } from "../dto/classes/FormResponse";
import { IFormResponse } from "../dto/interfaces/IFormResponse";
import { Methods } from "../shared/methods";
import { Discussion } from "../entities/Discussion";
import { User } from "../entities/User";
import { UserService } from "./userService";
import { MapComment } from "../mapping/mapComment";
import { Request } from "express";
import { TimelineUpdate } from "../entities/TimelineUpdate";
import { TimelinePhoto } from "../entities/TimelinePhoto";
import { Webinar } from "../entities/Webinar";
import { Article } from "../entities/Article";

export namespace CommentService {
	export async function addCommentAsync(req: Request, comment: Comment): Promise<IJsonResponse<FormResponse<Comment>>> {
		const validationResult = await validate(comment);

		if (validationResult.length > 0) {
			const invalidResponse = new FormResponse<Comment>({
				isValid: false,
				errors: validationResult.map(e => e.constraints[Object.keys(e.constraints)[0]])
			} as IFormResponse);

			return Methods.getJsonResponse(invalidResponse, "Comment data provided was not valid", false);
		}

		const commentRepository = getRepository(Comment);
		const { content, parentComment, discussion, article, timelineUpdate, timelinePhoto, webinar } = comment;

		const commentToCreate = new Comment({
			content,
			article: !!article ? new Article({ id: article.id }) : null,
			discussion: !!discussion ? new Discussion({ id: discussion.id }) : null,
			timelineUpdate: !!timelineUpdate ? new TimelineUpdate({ id: timelineUpdate.id }) : null,
			timelinePhoto: !!timelinePhoto ? new TimelinePhoto({ id: timelinePhoto.id }) : null,
			webinar: !!webinar ? new Webinar({ id: webinar.id }) : null,
			parentComment: !!parentComment ? new Comment({ id: parentComment.id }) : null,
			author: new User({ id: UserService.getAuthenticatedUserId(req) })
		} as Comment);
		if (!!commentToCreate.parentComment) commentToCreate.article = null;

		const createdComment = await commentRepository.save(commentToCreate);
		const validResponse = new FormResponse<Comment>({
			isValid: true,
			target: MapComment.inAllControllers(createdComment)
		});

		return Methods.getJsonResponse(validResponse);
	}
}
