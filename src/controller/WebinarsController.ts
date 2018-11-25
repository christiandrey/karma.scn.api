import * as moment from "moment";
import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Methods } from "../shared/methods";
import { validate } from "class-validator";
import { FormResponse } from "../dto/classes/FormResponse";
import { IFormResponse } from "../dto/interfaces/IFormResponse";
import { Webinar } from "../entities/Webinar";
import { MapWebinar } from "../mapping/mapWebinar";
import { User } from "../entities/User";
import { WebinarStatusEnum } from "../enums/WebinarStatusEnum";
import { UserService } from "../services/userService";
import { Notification } from "../entities/Notification";
import { NotificationTypeEnum } from "../enums/NotificationTypeEnum";
import { NotificationService } from "../services/notificationService";
import { Constants } from "../shared/constants";
import { Announcement } from "../entities/Announcement";
import { CacheService } from "../services/cacheService";
import { CommentService } from "../services/commentService";
import { Comment } from "../entities/Comment";

export class WebinarsController {
	private webinarRepository = getRepository(Webinar);
	private userRepository = getRepository(User);

	async getAllAsync(req: Request, resp: Response, next: NextFunction) {
		const webinars = await this.webinarRepository.find({
			order: {
				createdDate: "DESC"
			}
		});

		const response = webinars.map(x => MapWebinar.inWebinarControllersGetAllAsync(x));

		return Methods.getJsonResponse(response, `${webinars.length} webinars found`);
	}

	async getTotalCpdPoints(req: Request, resp: Response, next: NextFunction) {
		const webinars = await this.webinarRepository.find({
			where: {
				status: WebinarStatusEnum.Finished
			}
		});

		let points = 0;

		if (!!webinars && webinars.length > 0) {
			points = webinars.map(x => x.cpdPoints).reduce((a, b) => a + b, 0);
		}

		return Methods.getJsonResponse({ points });
	}

	async getByUrlTokenAsync(req: Request, resp: Response, next: NextFunction) {
		const urlToken = req.params.urlToken as string;
		const webinar = await this.webinarRepository.findOne({ urlToken });

		if (!webinar) {
			Methods.sendErrorResponse(resp, 404, "Webinar was not found");
		}

		const comments = await CacheService.getCacheItemValue(Constants.commentsTree, async () => await CommentService.findTrees());

		webinar.comments = comments.filter(x => !!x.webinar && x.webinar.id === webinar.id);

		const response = MapWebinar.inWebinarControllersGetByUrlTokenAsync(webinar);

		return Methods.getJsonResponse(response);
	}

	async createAsync(req: Request, resp: Response, next: NextFunction) {
		const webinar = new Webinar(req.body);

		// ------------------------------------------------------------------------
		// Validate the data
		// ------------------------------------------------------------------------

		const validationResult = await validate(webinar);
		if (validationResult.length > 0) {
			const invalidResponse = new FormResponse({
				isValid: false,
				errors: validationResult.map(e => e.constraints[Object.keys(e.constraints)[0]])
			} as IFormResponse);
			return Methods.getJsonResponse(invalidResponse, "Webinar data provided was not valid", false);
		}

		// ------------------------------------------------------------------------
		// Create New Entity
		// ------------------------------------------------------------------------

		let { anchor, cpdPoints, topic, description, startDateTime, createAnnouncement } = webinar;
		const authUserId = UserService.getAuthenticatedUserId(req);
		const webinarToCreate = new Webinar({
			cpdPoints,
			topic,
			description,
			startDateTime,
			createAnnouncement,
			status: WebinarStatusEnum.Created,
			anchor: new User({ id: anchor.id }),
			author: new User({ id: authUserId })
		});

		const createdWebinar = await this.webinarRepository.save(webinarToCreate);

		// ------------------------------------------------------------------------
		// Send Notifications
		// ------------------------------------------------------------------------

		if (!!createdWebinar) {
			anchor = await this.userRepository.findOne({ id: createdWebinar.anchor.id });
			const notification = new Notification({
				content: `A webinar has been scheduled for ${moment(createdWebinar.startDateTime).calendar()}. The topic is ${createdWebinar.topic} and it will be anchored by ${
					anchor.firstName
				} ${anchor.lastName}. We'll send you a reminder 1 hour to the start time.`,
				type: NotificationTypeEnum.WebinarStart,
				data: JSON.stringify({
					urlToken: createdWebinar.urlToken
				}),
				hasBeenRead: false
			} as Notification);

			try {
				await NotificationService.sendNotificationToAllAsync(req, notification);
				//TODO: Send Email reminders to all users 1 hour before webinar starts
				//TODO: Send Email reminder to anchor telling him that he has been assigned to anchor a webinar. The email should contain the link to the webinar.
			} catch (error) {}
		}

		// ------------------------------------------------------------------------
		// Create announcement if specified
		// ------------------------------------------------------------------------

		if (createAnnouncement) {
			const announcementRepository = getRepository(Announcement);
			const announcementToCreate = new Announcement({
				content: `A webinar has been scheduled for ${moment(createdWebinar.startDateTime).calendar()}. The topic is ${createdWebinar.topic} and it will be anchored by ${
					anchor.firstName
				} ${anchor.lastName}. We'll send you a reminder 1 hour to the start time.`,
				isPublished: true,
				publicationDate: new Date(),
				author: new User({ id: authUserId })
			} as Announcement);
			try {
				await announcementRepository.save(announcementToCreate);
			} catch (error) {}
		}

		const validResponse = new FormResponse<Webinar>({
			isValid: true,
			target: MapWebinar.inWebinarControllersCreateAsync(createdWebinar)
		});

		CacheService.invalidateCacheItem(Constants.sortedTimelinePosts);
		return Methods.getJsonResponse(validResponse);
	}

	async updateAsync(req: Request, resp: Response, next: NextFunction) {
		const webinar = new Webinar(req.body);
		const validationResult = await validate(webinar);

		if (validationResult.length > 0) {
			const invalidResponse = new FormResponse({
				isValid: false,
				errors: validationResult.map(e => e.constraints[Object.keys(e.constraints)[0]])
			} as IFormResponse);
			return Methods.getJsonResponse(invalidResponse, "Webinar data provided was not valid", false);
		}

		const dbWebinar = await this.webinarRepository.findOne({ id: webinar.id });

		if (!dbWebinar) {
			Methods.sendErrorResponse(resp, 404, "Webinar was not found");
			return;
		}

		if (dbWebinar.status === WebinarStatusEnum.Started || dbWebinar.status === WebinarStatusEnum.Finished || dbWebinar.status === WebinarStatusEnum.Archived) {
			Methods.sendErrorResponse(resp, 400, "A webinar can only be edited before it has started");
			return;
		}

		const { anchor, cpdPoints, topic, description } = webinar;
		dbWebinar.topic = topic;
		dbWebinar.description = description;
		dbWebinar.cpdPoints = cpdPoints;
		dbWebinar.anchor = new User({ id: anchor.id });

		const updatedWebinar = await this.webinarRepository.save(dbWebinar);
		const validResponse = new FormResponse<Webinar>({
			isValid: true,
			target: MapWebinar.inWebinarControllersUpdateAsync(updatedWebinar)
		});
		return Methods.getJsonResponse(validResponse);
	}

	async joinAsync(req: Request, resp: Response, next: NextFunction) {
		const dbWebinar = await this.webinarRepository.findOne(req.params.id);

		if (!dbWebinar) {
			Methods.sendErrorResponse(resp, 404, "Webinar was not found");
			return;
		}

		if (dbWebinar.status !== WebinarStatusEnum.Started) {
			Methods.sendErrorResponse(resp, 400, "Only an ongoing webinar can be joined");
			return;
		}

		const authUserId = UserService.getAuthenticatedUserId(req);
		dbWebinar.participants.push(new User({ id: authUserId }));

		const updatedWebinar = await this.webinarRepository.save(dbWebinar);
		if (!!updatedWebinar) {
			const response = MapWebinar.inWebinarControllersJoinStartFinishAsync(updatedWebinar);
			return Methods.getJsonResponse(response, "Webinar was successfully joined");
		} else {
			Methods.sendErrorResponse(resp, 500);
			return;
		}
	}

	async startAsync(req: Request, resp: Response, next: NextFunction) {
		const dbWebinar = await this.webinarRepository.findOne(req.params.id);

		if (!dbWebinar) {
			Methods.sendErrorResponse(resp, 404, "Webinar was not found");
			return;
		}

		if (dbWebinar.status === WebinarStatusEnum.Finished || dbWebinar.status === WebinarStatusEnum.Archived) {
			Methods.sendErrorResponse(resp, 400, "Only an unstarted webinar can be started");
			return;
		}

		const authUserId = UserService.getAuthenticatedUserId(req);
		if (dbWebinar.anchor.id !== authUserId) {
			Methods.sendErrorResponse(resp, 401);
			return;
		}

		dbWebinar.status = WebinarStatusEnum.Started;
		const startedWebinar = await this.webinarRepository.save(dbWebinar);

		// ------------------------------------------------------------------------
		// Send Notifications
		// ------------------------------------------------------------------------

		const notification = new Notification({
			content: `The webinar, ${dbWebinar.topic} was just started. Join in now!`,
			type: NotificationTypeEnum.WebinarStart,
			data: JSON.stringify({
				urlToken: dbWebinar.urlToken
			}),
			hasBeenRead: false
		} as Notification);

		try {
			await NotificationService.sendNotificationToAllAsync(req, notification);
		} catch (error) {}

		const response = MapWebinar.inWebinarControllersJoinStartFinishAsync(startedWebinar);

		return Methods.getJsonResponse(response, "Webinar was successfully started");
	}

	async finishAsync(req: Request, resp: Response, next: NextFunction) {
		const dbWebinar = await this.webinarRepository.findOne(req.params.id);

		if (!dbWebinar) {
			Methods.sendErrorResponse(resp, 404, "Webinar was not found");
			return;
		}

		if (dbWebinar.status !== WebinarStatusEnum.Started) {
			Methods.sendErrorResponse(resp, 400, "Only an already started webinar can be ended");
			return;
		}

		const authUserId = UserService.getAuthenticatedUserId(req);
		if (dbWebinar.anchor.id !== authUserId) {
			Methods.sendErrorResponse(resp, 401);
			return;
		}

		dbWebinar.status = WebinarStatusEnum.Finished;
		const finishedWebinar = await this.webinarRepository.save(dbWebinar);

		// ------------------------------------------------------------------------
		// Allocate cpdPoints to participants
		// ------------------------------------------------------------------------

		const participants = dbWebinar.participants;

		participants.forEach(x => {
			x.cpdPoints += dbWebinar.cpdPoints;
		});

		await this.userRepository.save(participants);

		const response = MapWebinar.inWebinarControllersJoinStartFinishAsync(finishedWebinar);

		return Methods.getJsonResponse(response, "Webinar was successfully ended");
	}

	async addCommentAsync(req: Request, resp: Response, next: NextFunction) {
		const webinar = await this.webinarRepository.findOne({ id: req.params.id });

		if (!webinar) {
			Methods.sendErrorResponse(resp, 404, "Webinar was not found");
			return;
		}

		if (webinar.status === WebinarStatusEnum.Default || webinar.status === WebinarStatusEnum.Created) {
			Methods.sendErrorResponse(resp, 400);
			return;
		}

		const comment = new Comment(req.body);
		comment.webinar = new Webinar({ id: webinar.id });

		const response = await CommentService.addCommentAsync(req, comment);

		if (response.status) {
			CacheService.invalidateCacheItem(Constants.sortedTimelinePosts);
		}
		return response;
	}
}
