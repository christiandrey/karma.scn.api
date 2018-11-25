import { Request } from "express";
import { UserService } from "./userService";
import { SocketRecord } from "../entities/SocketRecord";
import { User } from "../entities/User";
import { getRepository } from "typeorm";
import { Comment } from "../entities/Comment";
import { Discussion } from "../entities/Discussion";
import { CommentService } from "./commentService";
import { Webinar } from "../entities/Webinar";
import { Notification } from "../entities/Notification";

export namespace SocketService {
	// -------------------------------------------------------------------------------------------------
	/** Create a socket record for the currently connected user */
	export async function createSocketRecord(req: Request, socketId): Promise<boolean> {
		const authUserId = UserService.getAuthenticatedUserId(req);
		const socketRecordRepository = getRepository(SocketRecord);
		const socketRecordToCreate = new SocketRecord({
			socketId,
			user: new User({ id: authUserId })
		} as SocketRecord);
		try {
			await socketRecordRepository.save(socketRecordToCreate);
			return true;
		} catch (error) {
			return false;
		}
	}

	// -------------------------------------------------------------------------------------------------
	/** Deletes a socket record for the currently connected user */
	export async function deleteSocketRecord(socketId): Promise<boolean> {
		const socketRecordRepository = getRepository(SocketRecord);
		const socketRecordToRemove = await socketRecordRepository.findOne({ socketId });
		try {
			await socketRecordRepository.remove(socketRecordToRemove);
			return true;
		} catch (error) {
			return false;
		}
	}

	// -------------------------------------------------------------------------------------------------
	/** Adds a comment to a particular discussion */
	export async function addDiscussionComment(req: Request, comment: Comment, id: string): Promise<Comment> {
		const discussionRepository = getRepository(Discussion);
		const discussion = await discussionRepository.findOne({ id });

		if (comment.content === "" || comment.content.replace(/\s+/g, "") === "") {
			return undefined;
		}

		const commentToCreate = new Comment(comment);
		commentToCreate.discussion = new Discussion({ id: discussion.id });
		const createdComment = await CommentService.addCommentAsync(req, comment);
		return createdComment.data.target;
	}

	// -------------------------------------------------------------------------------------------------
	/** Adds a comment to a particular webinar */
	export async function addWebinarComment(req: Request, comment: Comment, id: string): Promise<Comment> {
		const webinarRepository = getRepository(Webinar);
		const webinar = await webinarRepository.findOne({ id });

		if (comment.content === "" || comment.content.replace(/\s+/g, "") === "") {
			return undefined;
		}

		const commentToCreate = new Comment(comment);
		commentToCreate.webinar = new Webinar({ id: webinar.id });
		const createdComment = await CommentService.addCommentAsync(req, comment);
		return createdComment.data.target;
	}

	// -------------------------------------------------------------------------------------------------
	/** Send a notification alert to specified user */
	export async function emitNotificationEventAsync(req: Request, notification: Notification): Promise<void> {
		const userRepository = getRepository(User);
		const user = await userRepository.findOne(notification.user.id, {
			relations: ["socketRecords"]
		});
		const socketRecords = user.socketRecords;
		socketRecords.forEach(s => {
			req.io.to(`${s.socketId}`).emit("notification", notification);
		});
	}

	// -------------------------------------------------------------------------------------------------
	/** Send a notification alert to every connected user */
	export async function emitNotificationEventToAllAsync(req: Request, notification: Notification): Promise<void> {
		req.io.emit("notification", notification);
	}

	// -------------------------------------------------------------------------------------------------
	/** Write webinar video stream to file */
	export function writeWebinarVideoStreamToFile(stream: any) {}
}
