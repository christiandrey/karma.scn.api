import { NextFunction, Request, Response } from "express";
import { User } from "../entities/User";
import { getRepository } from "typeorm";
import { Methods } from "../shared/methods";
import { UserTypeEnum } from "../enums/UserTypeEnum";
import { Article } from "../entities/Article";
import { MapArticle } from "../mapping/mapArticle";
import { validate } from "class-validator";
import { FormResponse } from "../dto/classes/FormResponse";
import { IFormResponse } from "../dto/interfaces/IFormResponse";
import { Media } from "../entities/Media";
import { ArticleCategory } from "../entities/ArticleCategory";
import { ArticleStatusEnum } from "../enums/ArticleStatusEnum";
import { UserService } from "../services/userService";
import { CommentService } from "../services/commentService";
import { Comment } from "../entities/Comment";
import { Constants } from "../shared/constants";
import { CacheService } from "../services/cacheService";
import { Like } from "../entities/Like";
import { LikeService } from "../services/likeService";

export class ArticlesController {
	private articleRepository = getRepository(Article);
	private likeRepository = getRepository(Like);

	async getLatestAsync(req: Request, resp: Response, next: NextFunction) {
		const articles = await this.articleRepository
			.createQueryBuilder("article")
			.where("article.isPublished = :isPublished", { isPublished: true })
			.leftJoinAndSelect("article.author", "user")
			.leftJoinAndSelect("article.featuredImage", "featuredImage")
			.leftJoinAndSelect("article.category", "category")
			.orderBy("article.createdDate", "DESC")
			.skip(0)
			.take(4)
			.getMany();

		const response = articles.map(a => MapArticle.inArticlesControllerGetLatestAsync(a));

		return Methods.getJsonResponse(response);
	}

	async getAllAsync(req: Request, resp: Response, next: NextFunction) {
		const articles = await this.articleRepository
			.createQueryBuilder("article")
			.where("article.isPublished = :isPublished", { isPublished: true })
			.leftJoinAndSelect("article.author", "user")
			.leftJoinAndSelect("article.featuredImage", "featuredImage")
			.leftJoinAndSelect("article.category", "category")
			.orderBy("article.createdDate", "DESC")
			.getMany();

		const response = articles.map(a => MapArticle.inArticlesControllerGetAll(a));

		return Methods.getJsonResponse(response, `${articles.length} articles found`);
	}

	async getByUrlTokenAsync(req: Request, resp: Response, next: NextFunction) {
		const urlToken = req.params.urlToken as string;

		const article = await this.articleRepository
			.createQueryBuilder("article")
			.where("article.urlToken = :urlToken", { urlToken })
			.leftJoinAndSelect("article.author", "user")
			.leftJoinAndSelect("user.company", "company")
			.leftJoinAndSelect("article.featuredImage", "featuredImage")
			.leftJoinAndSelect("article.category", "category")
			.getOne();

		if (!article || !article.isPublished) {
			Methods.sendErrorResponse(resp, 404, "Article was not found");
			return;
		}

		const comments = await CacheService.getCacheItemValue(Constants.commentsTree, async () => await CommentService.findTrees());

		article.comments = comments.filter(x => !!x.article && x.article.id === article.id);

		const response = MapArticle.inArticlesControllerGetByUrlToken(article);

		return Methods.getJsonResponse(response);
	}

	async createAsync(req: Request, resp: Response, next: NextFunction) {
		const article = new Article(req.body);

		// ------------------------------------------------------------------------
		// Validate the data
		// ------------------------------------------------------------------------

		const validationResult = await validate(article);
		if (validationResult.length > 0) {
			const invalidResponse = new FormResponse({
				isValid: false,
				errors: validationResult.map(e => e.constraints[Object.keys(e.constraints)[0]])
			} as IFormResponse);
			return Methods.getJsonResponse(invalidResponse, "Article data provided was not valid", false);
		}

		// ------------------------------------------------------------------------
		// Check for existing Entity
		// ------------------------------------------------------------------------

		const urlToken = article.title
			.toLowerCase()
			.replace(/[^a-z0-9-\s+]/g, "")
			.replace(/\s+/g, "-")
			.replace(/\-+/g, "-");
		const dbArticle = await this.articleRepository.findOne({ urlToken });
		if (!!dbArticle) {
			const invalidResponse = new FormResponse({
				isValid: false,
				errors: ["An article with the same title already exists"]
			} as IFormResponse);
			return Methods.getJsonResponse(invalidResponse, "An article with the same title already exists", false);
		}

		// ------------------------------------------------------------------------
		// Create New Entity
		// ------------------------------------------------------------------------

		const { title, synopsis, body } = article;

		const articleToCreate = new Article({
			title,
			synopsis,
			body,
			isPublished: false,
			status: ArticleStatusEnum.Pending,
			featuredImage: new Media({ id: article.featuredImage.id, url: article.featuredImage.url }),
			category: new ArticleCategory({ id: article.category.id }),
			author: new User({ id: UserService.getAuthenticatedUserId(req) })
		} as Article);

		const createdArticle = await this.articleRepository.save(articleToCreate);
		const validResponse = new FormResponse<Article>({
			isValid: true,
			target: MapArticle.inArticlesControllerCreateAsync(createdArticle)
		});
		CacheService.invalidateCacheItem(Constants.sortedTimelinePosts);
		return Methods.getJsonResponse(validResponse);
	}

	async updateAsync(req: Request, resp: Response, next: NextFunction) {
		const article = new Article(req.body);
		const validationResult = await validate(article);

		if (validationResult.length > 0) {
			const invalidResponse = new FormResponse({
				isValid: false,
				errors: validationResult.map(e => e.constraints[Object.keys(e.constraints)[0]])
			} as IFormResponse);
			return Methods.getJsonResponse(invalidResponse, "Article data provided was not valid", false);
		}

		const authenticatedUser = await UserService.getAuthenticatedUserAsync(req);
		const dbArticle = await this.articleRepository.findOne({ id: article.id });

		if (!dbArticle) {
			Methods.sendErrorResponse(resp, 404, "Article was not found");
			return;
		}

		if (dbArticle.isPublished) {
			if (authenticatedUser.type !== UserTypeEnum.Admin) {
				Methods.sendErrorResponse(resp, 401, "Only Administrators can edit articles after they have been published");
				return;
			}
		}

		const { title, synopsis, body } = article;

		dbArticle.title = title;
		dbArticle.synopsis = synopsis;
		dbArticle.body = body;
		dbArticle.featuredImage = new Media({ id: article.featuredImage.id });
		dbArticle.category = new ArticleCategory({ id: article.category.id });

		const updatedArticle = await this.articleRepository.save(dbArticle);
		const validResponse = new FormResponse<Article>({
			isValid: true,
			target: MapArticle.inArticlesControllerUpdateAsync(updatedArticle)
		});
		CacheService.invalidateCacheItem(Constants.sortedTimelinePosts);
		return Methods.getJsonResponse(validResponse);
	}

	async publishAsync(req: Request, resp: Response, next: NextFunction) {
		const id = req.params.id as string;
		const article = await this.articleRepository.findOne(id);

		if (!article) {
			Methods.sendErrorResponse(resp, 404, "Article was not found");
			return;
		}

		if (article.isPublished) {
			Methods.sendErrorResponse(resp, 400, "Article has already been published");
			return;
		}

		article.isPublished = true;
		article.publicationDate = new Date();

		const publishedArticle = await this.articleRepository.save(article);
		const response = MapArticle.inArticlesControllerPublishAsync(publishedArticle);

		CacheService.invalidateCacheItem(Constants.sortedTimelinePosts);
		return Methods.getJsonResponse(response, "Article was successfully published");
	}

	async unPublishAsync(req: Request, resp: Response, next: NextFunction) {
		const id = req.params.id as string;
		const article = await this.articleRepository.findOne(id);

		if (!article) {
			Methods.sendErrorResponse(resp, 404, "Article was not found");
			return;
		}

		if (!article.isPublished) {
			Methods.sendErrorResponse(resp, 400, "Article is not yet published");
			return;
		}

		article.isPublished = false;

		const unpublishedArticle = await this.articleRepository.save(article);
		const response = MapArticle.inArticlesControllerPublishAsync(unpublishedArticle);

		CacheService.invalidateCacheItem(Constants.sortedTimelinePosts);
		return Methods.getJsonResponse(response, "Article was successfully unpublished");
	}

	async addCommentAsync(req: Request, resp: Response, next: NextFunction) {
		const article = await this.articleRepository
			.createQueryBuilder("article")
			.where("id = :articleId", { articleId: req.params.id })
			.getOne();

		if (!article) {
			Methods.sendErrorResponse(resp, 404, "Article was not found");
			return;
		}

		if (!article.isPublished) {
			Methods.sendErrorResponse(resp, 400);
			return;
		}

		const comment = new Comment(req.body);
		comment.article = new Article({ id: article.id });

		const response = await CommentService.addCommentAsync(req, comment);

		if (response.status) {
			CacheService.invalidateCacheItem(Constants.sortedTimelinePosts);
		}
		return response;
	}

	async likeArticleAsync(req: Request, resp: Response, next: NextFunction) {
		const article = await this.articleRepository
			.createQueryBuilder("article")
			.where("id = :articleId", { articleId: req.params.id })
			.getOne();

		if (!article) {
			Methods.sendErrorResponse(resp, 404, "Article was not found");
			return;
		}

		const like = new Like(req.body);
		like.article = new Article({ id: article.id });

		const result = await LikeService.addLikeAsync(req, like);
		if (result.status) {
			CacheService.invalidateCacheItem(Constants.sortedTimelinePosts);
			return result;
		} else {
			resp.status(400).send(result);
		}
	}

	async unlikeArticleAsync(req: Request, resp: Response, next: NextFunction) {
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
