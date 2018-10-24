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

export class ArticlesController {

    private articleRepository = getRepository(Article);

    async getLatestAsync(req: Request, resp: Response, next: NextFunction) {
        const articles = await this.articleRepository.find({
            where: {
                isPublished: true
            },
            order: {
                createdDate: "DESC"
            },
            skip: 0,
            take: 4
        });

        const response = articles.map(a => MapArticle.inArticlesControllerGetLatestAsync(a));

        return Methods.getJsonResponse(response);
    }

    async getAll(req: Request, resp: Response, next: NextFunction) {
        const articles = await this.articleRepository.find({
            where: {
                isPublished: true
            },
            order: {
                createdDate: "DESC"
            }
        });

        const response = articles.map(a => MapArticle.inArticlesControllerGetLatestAsync(a));

        return Methods.getJsonResponse(response, `${articles.length} articles found`);
    }

    async getByUrlToken(req: Request, resp: Response, next: NextFunction) {
        const urlToken = req.params.urlToken as string;
        const article = await this.articleRepository.findOne({ urlToken });

        if (!!article) {
            Methods.sendErrorResponse(resp, 404, "Article was not found");
        }

        const response = MapArticle.inArticlesControllerGetByUrlToken(article);

        return Methods.getJsonResponse(response);
    }

    async createAsync(req: Request, resp: Response, next: NextFunction) {
        const article = req.body as Article;

        // ------------------------------------------------------------------------
        // Validate the data
        // ------------------------------------------------------------------------

        const validationResult = await validate(article);
        if (validationResult.length > 0) {
            const invalidResponse = new FormResponse({
                isValid: false,
                errors: validationResult.map(e => e.toString())
            } as IFormResponse);
            return Methods.getJsonResponse(invalidResponse, "Article data provided was not valid", false);
        }

        // ------------------------------------------------------------------------
        // Check for existing Entity
        // ------------------------------------------------------------------------

        const urlToken = article.title.toLowerCase().replace(/[^a-z0-9-\s+]/g, "").replace(/\s+/g, "-").replace(/\-+/g, "-");
        const existingArticle = await this.articleRepository.findOne({ urlToken });
        if (!!existingArticle) {
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
        const featuredImage = new Media();
        const articleCategory = new ArticleCategory();
        const articleToCreate = new Article();
        const author = new User();

        featuredImage.id = article.featuredImage.id;
        articleCategory.id = article.category.id;
        author.id = UserService.getAuthenticatedUserId(req);

        articleToCreate.title = title;
        articleToCreate.synopsis = synopsis;
        articleToCreate.body = body;
        articleToCreate.featuredImage = featuredImage;
        articleToCreate.category = articleCategory;
        articleToCreate.status = ArticleStatusEnum.Pending;
        articleToCreate.author = author;

        const dbArticle = await this.articleRepository.save(articleToCreate);
        const validResponse = new FormResponse<Article>({
            isValid: true,
            target: MapArticle.inArticlesControllerCreateAsync(dbArticle)
        });
        return Methods.getJsonResponse(validResponse);
    }

    async updateAsync(req: Request, resp: Response, next: NextFunction) {
        const article = req.body as Article;
        const authenticatedUser = await UserService.getAuthenticatedUserAsync(req);
        const validationResult = await validate(Article);

        if (validationResult.length > 0) {
            const invalidResponse = new FormResponse({
                isValid: false,
                errors: validationResult.map(e => e.toString())
            } as IFormResponse);
            return Methods.getJsonResponse(invalidResponse, "Article data provided was not valid", false);
        }

        const existingArticle = await this.articleRepository.findOne({ id: article.id });

        if (!existingArticle) {
            Methods.sendErrorResponse(resp, 404, "Article was not found");
            return;
        }

        if (existingArticle.isPublished) {
            if (authenticatedUser.type !== UserTypeEnum.Admin) {
                Methods.sendErrorResponse(resp, 401, "Only Administrators can edit articles after they have been published");
                return;
            }
        }

        const { title, synopsis, body } = article;
        const featuredImage = new Media();
        const articleCategory = new ArticleCategory();

        article.title = title;
        article.synopsis = synopsis;
        article.body = body;
        article.featuredImage = featuredImage;
        article.category = articleCategory;

        const dbArticle = await this.articleRepository.save(existingArticle);
        const validResponse = new FormResponse<Article>({
            isValid: true,
            target: MapArticle.inArticlesControllerUpdateAsync(dbArticle)
        });
        return Methods.getJsonResponse(validResponse);
    }

    async publishAsync(req: Request, resp: Response, next: NextFunction) {
        const id = req.params.id as string;
        const article = await this.articleRepository.findOne(id);

        if (!!article) {
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

        return Methods.getJsonResponse(response, "Article was successfully published");
    }

    async unPublishAsync(req: Request, resp: Response, next: NextFunction) {
        const id = req.params.id as string;
        const article = await this.articleRepository.findOne(id);

        if (!!article) {
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

        return Methods.getJsonResponse(response, "Article was successfully unpublished");
    }
}