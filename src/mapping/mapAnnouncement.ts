import { Announcement } from "../entities/Announcement";

export namespace MapAnnouncement {

    export function inAnnouncementsControllerAllMethods(announcement: Announcement): Announcement {
        const { content, isPublished, publicationDate } = announcement;

        return {
            content, isPublished, publicationDate
        } as Announcement;
    }
}