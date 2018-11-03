import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { User } from "../entities/User";
import { Announcement } from "../entities/Announcement";
import { MapAnnouncement } from "../mapping/mapAnnouncement";
import { Methods } from "../shared/methods";
import { validate } from "class-validator";
import { FormResponse } from "../dto/classes/FormResponse";
import { IFormResponse } from "../dto/interfaces/IFormResponse";
import { UserService } from "../services/userService";
import { Constants } from "../shared/constants";
import { Notification } from "../entities/Notification";
import { NotificationTypeEnum } from "../enums/NotificationTypeEnum";
import { NotificationService } from "../services/notificationService";
import { CacheService } from "../services/cacheService";

export class AnnouncementsController {

    private announcementRepository = getRepository(Announcement);

    async getAllAsync(req: Request, resp: Response, next: NextFunction) {
        const announcements = await this.announcementRepository.find({
            where: {
                isPublished: true
            },
            order: {
                createdDate: "DESC"
            }
        });

        const response = announcements.map(a => MapAnnouncement.inAnnouncementsControllerAllMethods(a));

        return Methods.getJsonResponse(response, `${announcements.length} announcements found`);
    }

    async createAsync(req: Request, resp: Response, next: NextFunction) {
        const announcement = new Announcement(req.body);

        // ------------------------------------------------------------------------
        // Validate the data
        // ------------------------------------------------------------------------

        const validationResult = await validate(announcement);
        if (validationResult.length > 0) {
            const invalidResponse = new FormResponse({
                isValid: false,
                errors: validationResult.map(e => e.constraints)
            } as IFormResponse);
            return Methods.getJsonResponse(invalidResponse, "Announcement data provided was not valid", false);
        }

        // ------------------------------------------------------------------------
        // Create New Entity
        // ------------------------------------------------------------------------

        const { content, isPublished } = announcement;

        const announcementToCreate = new Announcement({
            content, isPublished,
            author: new User({ id: UserService.getAuthenticatedUserId(req) })
        });

        const createdAnnouncement = await this.announcementRepository.save(announcementToCreate);
        const validResponse = new FormResponse<Announcement>({
            isValid: true,
            target: MapAnnouncement.inAnnouncementsControllerAllMethods(createdAnnouncement)
        });

        return Methods.getJsonResponse(validResponse);
    }

    async publishAsync(req: Request, resp: Response, next: NextFunction) {
        const id = req.params.id as string;
        const announcement = await this.announcementRepository.findOne(id);

        if (!announcement) {
            Methods.sendErrorResponse(resp, 404, "Announcement was not found");
            return;
        }

        if (announcement.isPublished) {
            Methods.sendErrorResponse(resp, 400, "Announcement has already been published");
            return;
        }

        announcement.isPublished = true;
        announcement.publicationDate = new Date();

        const publishedAnnouncement = await this.announcementRepository.save(announcement);
        const response = MapAnnouncement.inAnnouncementsControllerAllMethods(publishedAnnouncement);

        // ------------------------------------------------------------------------
        // Send Notifications
        // ------------------------------------------------------------------------

        if (!!publishedAnnouncement) {
            const notification = new Notification({
                content: publishedAnnouncement.content,
                type: NotificationTypeEnum.WebinarStart,
                hasBeenRead: false
            } as Notification);

            try {
                await NotificationService.sendNotificationToAllAsync(req, notification);
            } catch (error) { }
        }

        CacheService.invalidateCacheItem(Constants.sortedTimelinePosts);
        return Methods.getJsonResponse(response, "Announcement was successfully published");
    }

    async unPublishAsync(req: Request, resp: Response, next: NextFunction) {
        const id = req.params.id as string;
        const announcement = await this.announcementRepository.findOne(id);

        if (!announcement) {
            Methods.sendErrorResponse(resp, 404, "Announcement was not found");
            return;
        }

        if (!announcement.isPublished) {
            Methods.sendErrorResponse(resp, 400, "Announcement is not yet published");
            return;
        }

        announcement.isPublished = false;

        const unpublishedAnnouncement = await this.announcementRepository.save(announcement);
        const response = MapAnnouncement.inAnnouncementsControllerAllMethods(unpublishedAnnouncement);

        return Methods.getJsonResponse(response, "Announcement was successfully unpublished");
    }
}