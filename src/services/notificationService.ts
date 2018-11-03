import { Notification } from "../entities/Notification";
import { getRepository } from "typeorm";
import { User } from "../entities/User";
import { SocketService } from "./socketService";
import { Request } from "express";
import { MapUser } from "../mapping/mapUser";

export namespace NotificationService {

    // -------------------------------------------------------------------------------------------------
    /** Send notifiication asynchronously */
    export function sendNotificationAsync(req: Request, notification: Notification): Promise<boolean> {
        const notificationRepository = getRepository(Notification);
        return new Promise<boolean>(async (resolve, reject) => {
            const savedNotification = await notificationRepository.save(notification);
            if (!!savedNotification) {
                const notificationToEmit = savedNotification;
                notificationToEmit.user = MapUser.inAllControllers(savedNotification.user);
                await SocketService.emitNotificationEventAsync(req, notificationToEmit);
                resolve(true);
            } else {
                reject(false);
            }
        });
    }

    // -------------------------------------------------------------------------------------------------
    /** Send notifiication to all users asynchronously */
    export function sendNotificationToAllAsync(req: Request, notification: Notification): Promise<boolean> {
        const notificationRepository = getRepository(Notification);
        return new Promise<boolean>(async (resolve, reject) => {
            const userRepository = getRepository(User);
            const users = await userRepository.find();
            const notificationsToSend = users.map(x => {
                notification.user = new User({ id: x.id });
                return notification;
            });
            const savedNotifications = await notificationRepository.save(notificationsToSend);
            if (!!savedNotifications) {
                await SocketService.emitNotificationEventToAllAsync(req, notification);
                resolve(true);
            } else {
                reject(false);
            }
        });
    }
}