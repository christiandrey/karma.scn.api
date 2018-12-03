import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Methods } from "../shared/methods";
import { Notification } from "../entities/Notification";
import { UserService } from "../services/userService";
import { MapNotification } from "../mapping/mapNotification";

export class NotificationsController {
	private notificationRepository = getRepository(Notification);

	async getAllAsync(req: Request, resp: Response, next: NextFunction) {
		const authUserId = UserService.getAuthenticatedUserId(req);
		const notifications = await this.notificationRepository
			.createQueryBuilder("notification")
			.where("notification.user.id = :authUserId", { authUserId })
			.orderBy("notification.createdDate", "DESC")
			.getMany();
		const response = notifications.map(x => MapNotification.inNotificationsControllerGetAllAsync(x));
		return Methods.getJsonResponse(response, `${notifications.length} notifications found`);
	}

	async markAllNotificationsAsReadAsync(req: Request, resp: Response, next: NextFunction) {
		const authUserId = UserService.getAuthenticatedUserId(req);
		const notifications = await this.notificationRepository
			.createQueryBuilder("notification")
			.where("notification.user.id = :authUserId", { authUserId })
			.leftJoinAndSelect("notification.user", "user")
			.getMany();
		const unreadNotifications = notifications.filter(x => !x.hasBeenRead);
		const notificationsToUpdate = unreadNotifications.map(x => {
			x.hasBeenRead = true;
			return x;
		});
		await this.notificationRepository.save(notificationsToUpdate);
		return Methods.getJsonResponse({}, "All unread notifications have been marked as read");
	}
}
