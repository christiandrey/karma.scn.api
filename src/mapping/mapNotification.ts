import { Notification } from "../entities/Notification";

export namespace MapNotification {

    export function inNotificationService(notification: Notification): Notification {
        const { id, hasBeenRead, content, type, data } = notification;
        return {
            id, hasBeenRead, content, type, data
        } as Notification;
    }

    export function inNotificationsControllerGetAllAsync(notification: Notification): Notification {
        const { id, hasBeenRead, content, type, data } = notification;
        return {
            id, hasBeenRead, content, type, data
        } as Notification;
    }
}