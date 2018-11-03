import { Announcement } from "../entities/Announcement";

export namespace MapAnnouncement {

    export function inAnnouncementsControllerAllMethods(announcement: Announcement): Announcement {
        const { id, content, isPublished, publicationDate } = announcement;

        return {
            id, content, isPublished, publicationDate
        } as Announcement;
    }
}