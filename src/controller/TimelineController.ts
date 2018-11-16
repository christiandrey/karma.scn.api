import { NextFunction, Request, Response } from "express";
import { getRepository, getTreeRepository } from "typeorm";
import { Constants } from "../shared/constants";
import { Methods } from "../shared/methods";
import { TimelinePhoto } from "../entities/TimelinePhoto";
import { TimelineUpdate } from "../entities/TimelineUpdate";
import { Resource } from "../entities/Resource";
import { Job } from "../entities/Job";
import { Announcement } from "../entities/Announcement";
import { Article } from "../entities/Article";
import { TimelinePostTypeEnum } from "../enums/TimelinePostTypeEnum";
import { MapTimelinePost } from "../mapping/mapTimelinePost";
import { IPaginatedList } from "../dto/interfaces/IPaginatedList";
import { TimelinePost } from "../dto/classes/TimelinePost";
import { validate } from "class-validator";
import { FormResponse } from "../dto/classes/FormResponse";
import { IFormResponse } from "../dto/interfaces/IFormResponse";
import { User } from "../entities/User";
import { UserService } from "../services/userService";
import { Media } from "../entities/Media";
import { Comment } from "../entities/Comment";
import { Like } from "../entities/Like";
import { CommentService } from "../services/commentService";
import { LikeService } from "../services/likeService";
import { Webinar } from "../entities/Webinar";
import { CacheService } from "../services/cacheService";
import { WebinarStatusEnum } from "../enums/WebinarStatusEnum";

export class TimelineController {
	private timelinePhotoRepository = getRepository(TimelinePhoto);
	private timelineUpdateRepository = getRepository(TimelineUpdate);
	private likeRepository = getRepository(Like);
	private resourcesRepository = getRepository(Resource);
	private jobRepository = getRepository(Job);
	private announcementRepository = getRepository(Announcement);
	private articleRepository = getRepository(Article);
	private webinarRepository = getRepository(Webinar);

	async getLatestAsync(req: Request, resp: Response, next: NextFunction) {
		const page = +req.params.page;
		const pageSize = 25;

		const sortedTimelinePosts = await CacheService.getCacheItemValue(Constants.sortedTimelinePosts, async () => {
			const resources = await this.resourcesRepository
				.createQueryBuilder("resource")
				.where("isPublished = :isPublished", { isPublished: true })
				.leftJoinAndSelect("resource.user", "user")
				.leftJoinAndSelect("user.profilePhoto", "profilePhoto")
				.leftJoinAndSelect("user.experiences", "experience")
				.leftJoinAndSelect("user.address", "address")
				.leftJoinAndSelect("address.country", "country")
				.getMany();

			const jobs = await this.jobRepository
				.createQueryBuilder("job")
				.where("isPublished = :isPublished", { isPublished: true })
				.getMany();

			const announcements = await this.announcementRepository
				.createQueryBuilder("announcement")
				.where("isPublished = :isPublished", { isPublished: true })
				.getMany();

			const articles = await this.articleRepository
				.createQueryBuilder("article")
				.where("isPublished = :isPublished", { isPublished: true })
				.leftJoinAndSelect("article.featuredImage", "featuredImage")
				.leftJoinAndSelect("article.likes", "like")
				.leftJoinAndSelect("like.user", "user")
				.leftJoinAndSelect("article.author", "author")
				.leftJoinAndSelect("author.profilePhoto", "profilePhoto")
				.leftJoinAndSelect("author.experiences", "experience")
				.leftJoinAndSelect("author.address", "address")
				.leftJoinAndSelect("address.country", "country")
				.getMany();

			const timelinePhotos = await this.timelinePhotoRepository
				.createQueryBuilder("timelinePhoto")
				.leftJoinAndSelect("timelinePhoto.media", "media")
				.leftJoinAndSelect("timelinePhoto.likes", "like")
				.leftJoinAndSelect("like.user", "user")
				.leftJoinAndSelect("timelinePhoto.author", "author")
				.leftJoinAndSelect("author.profilePhoto", "profilePhoto")
				.leftJoinAndSelect("author.experiences", "experience")
				.leftJoinAndSelect("author.address", "address")
				.leftJoinAndSelect("address.country", "country")
				.getMany();

			const timelineUpdates = await this.timelineUpdateRepository
				.createQueryBuilder("timelineUpdate")
				.leftJoinAndSelect("timelineUpdate.likes", "like")
				.leftJoinAndSelect("like.user", "user")
				.leftJoinAndSelect("timelineUpdate.author", "author")
				.leftJoinAndSelect("author.profilePhoto", "profilePhoto")
				.leftJoinAndSelect("author.experiences", "experience")
				.leftJoinAndSelect("author.address", "address")
				.leftJoinAndSelect("address.country", "country")
				.getMany();

			const webinars = await this.webinarRepository
				.createQueryBuilder("webinar")
				.where("status = :status", { status: WebinarStatusEnum.Finished })
				.getMany();

			const comments = await CacheService.getCacheItemValue(Constants.commentsTree, async () => await CommentService.findTrees());

			const mappedResources = resources.map(x => Methods.getTimelinePostFrom(x, TimelinePostTypeEnum.Resource, comments));
			const mappedJobs = jobs.map(x => Methods.getTimelinePostFrom(x, TimelinePostTypeEnum.Job, comments));
			const mappedAnnouncements = announcements.map(x => Methods.getTimelinePostFrom(x, TimelinePostTypeEnum.Announcement, comments));
			const mappedArticles = articles.map(x => Methods.getTimelinePostFrom(x, TimelinePostTypeEnum.Article, comments));
			const mappedTimelinePhotos = timelinePhotos.map(x => Methods.getTimelinePostFrom(x, TimelinePostTypeEnum.Photo, comments));
			const mappedTimelineUpdates = timelineUpdates.map(x => Methods.getTimelinePostFrom(x, TimelinePostTypeEnum.Default, comments));
			const mappedWebinars = webinars.map(x => Methods.getTimelinePostFrom(x, TimelinePostTypeEnum.Webinar, comments));

			const timelinePosts = [
				...mappedResources,
				...mappedJobs,
				...mappedAnnouncements,
				...mappedArticles,
				...mappedTimelinePhotos,
				...mappedTimelineUpdates,
				...mappedWebinars
			];
			return Methods.sortByDate(timelinePosts);
		});

		const dto = Methods.getPaginatedItems(sortedTimelinePosts, pageSize, page).map(x => MapTimelinePost.inTimelineControllerGetLatestAsync(x));
		const totalItems = sortedTimelinePosts.length;
		const totalPages = totalItems >= pageSize ? (totalItems + pageSize) / pageSize : 1;
		const response = {
			page,
			pageSize,
			totalItems,
			totalPages,
			items: dto
		} as IPaginatedList<TimelinePost>;

		return Methods.getJsonResponse(response, `${dto.length} items returned`);
	}

	async createTimelineUpdateAsync(req: Request, resp: Response, next: NextFunction) {
		const timelineUpdate = new TimelineUpdate(req.body);

		// ------------------------------------------------------------------------
		// Validate the data
		// ------------------------------------------------------------------------

		const validationResult = await validate(timelineUpdate);

		if (validationResult.length > 0) {
			const invalidResponse = new FormResponse({
				isValid: false,
				errors: validationResult.map(e => e.constraints[Object.keys(e.constraints)[0]])
			} as IFormResponse);
			return Methods.getJsonResponse(invalidResponse, "Timeline update data provided was not valid", false);
		}

		// ------------------------------------------------------------------------
		// Create New Entity
		// ------------------------------------------------------------------------

		const { content } = timelineUpdate;
		const timelineUpdateToCreate = new TimelineUpdate({
			content: content.trim(),
			author: new User({ id: UserService.getAuthenticatedUserId(req) })
		});

		const createdTimelineUpdate = await this.timelineUpdateRepository.save(timelineUpdateToCreate);
		const validResponse = new FormResponse<TimelinePost>({
			isValid: true,
			target: Methods.getTimelinePostFrom(createdTimelineUpdate, TimelinePostTypeEnum.Default)
		});

		CacheService.invalidateCacheItem(Constants.sortedTimelinePosts);
		return Methods.getJsonResponse(validResponse);
	}

	async createTimelinePhotoAsync(req: Request, resp: Response, next: NextFunction) {
		const timelinePhoto = new TimelinePhoto(req.body);

		// ------------------------------------------------------------------------
		// Validate the data
		// ------------------------------------------------------------------------

		const validationResult = await validate(timelinePhoto);

		if (validationResult.length > 0) {
			const invalidResponse = new FormResponse({
				isValid: false,
				errors: validationResult.map(e => e.constraints[Object.keys(e.constraints)[0]])
			} as IFormResponse);
			return Methods.getJsonResponse(invalidResponse, "Timeline photo data provided was not valid", false);
		}

		// ------------------------------------------------------------------------
		// Create New Entity
		// ------------------------------------------------------------------------

		const { media, caption } = timelinePhoto;
		const timelineMediaToCreate = new TimelinePhoto({
			caption: !caption || caption.replace(/\s|\s+|\n/gm, "").length === 0 ? null : caption.trim(),
			media: new Media({ id: media.id, url: media.url }),
			author: new User({ id: UserService.getAuthenticatedUserId(req) })
		});

		const createdMediaUpdate = await this.timelinePhotoRepository.save(timelineMediaToCreate);
		const validResponse = new FormResponse<TimelinePost>({
			isValid: true,
			target: Methods.getTimelinePostFrom(createdMediaUpdate, TimelinePostTypeEnum.Photo)
		});

		CacheService.invalidateCacheItem(Constants.sortedTimelinePosts);
		return Methods.getJsonResponse(validResponse);
	}

	async addTimelineUpdateCommentAsync(req: Request, resp: Response, next: NextFunction) {
		const timelineUpdate = await this.timelineUpdateRepository
			.createQueryBuilder("timelineUpdate")
			.where("id = :timelineUpdateId", { timelineUpdateId: req.params.id })
			.getOne();

		if (!timelineUpdate) {
			Methods.sendErrorResponse(resp, 404, "Timeline Update was not found");
			return;
		}

		const comment = new Comment(req.body);
		comment.timelineUpdate = new TimelineUpdate({ id: timelineUpdate.id });

		const result = await CommentService.addCommentAsync(req, comment);

		if (result.status) {
			CacheService.invalidateCacheItem(Constants.sortedTimelinePosts);
		}
		return result;
	}

	async addTimelinePhotoCommentAsync(req: Request, resp: Response, next: NextFunction) {
		const timelinePhoto = await this.timelinePhotoRepository
			.createQueryBuilder("timelinePhoto")
			.where("id = :timelinePhotoId", { timelinePhotoId: req.params.id })
			.getOne();

		if (!timelinePhoto) {
			Methods.sendErrorResponse(resp, 404, "Timeline Photo was not found");
			return;
		}

		const comment = new Comment(req.body);
		comment.timelinePhoto = new TimelinePhoto({ id: timelinePhoto.id });

		const result = await CommentService.addCommentAsync(req, comment);

		if (result.status) {
			CacheService.invalidateCacheItem(Constants.sortedTimelinePosts);
		}
		return result;
	}

	async likeTimelineUpdateAsync(req: Request, resp: Response, next: NextFunction) {
		const timelineUpdate = await this.timelineUpdateRepository
			.createQueryBuilder("timelineUpdate")
			.where("id = :timelineUpdateId", { timelineUpdateId: req.params.id })
			.getOne();

		if (!timelineUpdate) {
			Methods.sendErrorResponse(resp, 404, "Timeline Update was not found");
			return;
		}

		const like = new Like(req.body);
		like.timelineUpdate = new TimelineUpdate({ id: timelineUpdate.id });

		const result = await LikeService.addLikeAsync(req, like);
		if (result.status) {
			CacheService.invalidateCacheItem(Constants.sortedTimelinePosts);
			return result;
		} else {
			resp.status(400).send(result);
		}
	}

	async likeTimelinePhotoAsync(req: Request, resp: Response, next: NextFunction) {
		const timelinePhoto = await this.timelinePhotoRepository
			.createQueryBuilder("timelinePhoto")
			.where("id = :timelinePhotoId", { timelinePhotoId: req.params.id })
			.getOne();

		if (!timelinePhoto) {
			Methods.sendErrorResponse(resp, 404, "Timeline Photo was not found");
			return;
		}

		const like = new Like(req.body);
		like.timelinePhoto = new TimelinePhoto({ id: timelinePhoto.id });

		const result = await LikeService.addLikeAsync(req, like);
		if (result.status) {
			CacheService.invalidateCacheItem(Constants.sortedTimelinePosts);
			return result;
		} else {
			resp.status(400).send(result);
		}
	}

	async unLikeTimelinePostAsync(req: Request, resp: Response, next: NextFunction) {
		const id = req.params.id;
		const like = await this.likeRepository.findOne(id);

		if (!like) {
			Methods.sendErrorResponse(resp, 404, "Like was not found");
			return;
		}

		const result = await LikeService.removeLikeAsync(id);

		if (result.status) {
			CacheService.invalidateCacheItem(Constants.sortedTimelinePosts);
			return result;
		} else {
			resp.status(400).send(result);
		}
	}
}
