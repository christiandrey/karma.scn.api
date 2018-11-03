import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Methods } from "../shared/methods"; import { ArticleCategory } from "../entities/ArticleCategory";
import { validate } from "class-validator";
import { FormResponse } from "../dto/classes/FormResponse";
import { IFormResponse } from "../dto/interfaces/IFormResponse";
import { MapArticleCategory } from "../mapping/mapArticleCategory";
import { Constants } from "../shared/constants";
import { CacheService } from "../services/cacheService";

export class ArticleCategoriesController {

    private articleCategoryRepository = getRepository(ArticleCategory);

    async getAllAsync(req: Request, resp: Response, next: NextFunction) {
        const articleCategories = await this.articleCategoryRepository.find();
        const response = articleCategories.map(x => MapArticleCategory.inArticleCategoriesControllerGetAllAsync(x));

        return Methods.getJsonResponse(response, `${articleCategories.length} article categor(ies) found`);
    }

    async createAsync(req: Request, resp: Response, next: NextFunction) {
        const articleCategory = new ArticleCategory(req.body);

        // ------------------------------------------------------------------------
        // Validate Incoming Data
        // ------------------------------------------------------------------------
        const validationResult = await validate(articleCategory);
        if (validationResult.length > 0) {
            const invalidResponse = new FormResponse({
                isValid: false,
                errors: validationResult.map(e => e.constraints)
            } as IFormResponse);
            return Methods.getJsonResponse(invalidResponse, "Article Category data provided was not valid", false);
        }

        // ------------------------------------------------------------------------
        // Check for existing Entity
        // ------------------------------------------------------------------------
        const dbArticleCategory = await this.articleCategoryRepository.findOne({ name: Methods.toCamelCase(articleCategory.title.replace(/[^a-zA-Z0-9\s\s+]/g, "")) });
        if (!!dbArticleCategory) {
            const invalidResponse = new FormResponse({
                isValid: false,
                errors: ["An article category with the same title already exists"]
            } as IFormResponse);
            return Methods.getJsonResponse(invalidResponse, "An article category with the same title already exists", false);
        }

        // ------------------------------------------------------------------------
        // Create New Entity
        // ------------------------------------------------------------------------
        const articleCategoryToCreate = new ArticleCategory({
            title: articleCategory.title
        });

        const createdArticleCategory = await this.articleCategoryRepository.save(articleCategoryToCreate);
        const validResponse = new FormResponse<ArticleCategory>({
            isValid: true,
            target: MapArticleCategory.inArticleCategoriesControllerCreateAsync(createdArticleCategory)
        });
        return Methods.getJsonResponse(validResponse);
    }

    async updateAsync(req: Request, resp: Response, next: NextFunction) {
        const articleCategory = new ArticleCategory(req.body);
        const validationResult = await validate(articleCategory);

        if (validationResult.length > 0) {
            const invalidResponse = new FormResponse({
                isValid: false,
                errors: validationResult.map(e => e.constraints)
            } as IFormResponse);
            return Methods.getJsonResponse(invalidResponse, "Article Category data provided was not valid", false);
        }

        const dbArticleCategory = await this.articleCategoryRepository.findOne({ id: articleCategory.id });

        if (!dbArticleCategory) {
            Methods.sendErrorResponse(resp, 404, "Article Category was not found");
            return;
        }

        dbArticleCategory.title = articleCategory.title;

        const updatedArticleCategory = await this.articleCategoryRepository.save(dbArticleCategory);
        const validResponse = new FormResponse<ArticleCategory>({
            isValid: true,
            target: MapArticleCategory.inArticleCategoriesControllerUpdateAsync(updatedArticleCategory)
        });
        CacheService.invalidateCacheItem(Constants.sortedTimelinePosts);
        return Methods.getJsonResponse(validResponse);
    }

    async deleteAsync(req: Request, resp: Response, next: NextFunction) {
        const articleCategoryToDelete = await this.articleCategoryRepository.findOne(req.params.id);

        if (!!articleCategoryToDelete) {
            try {
                const deletedArticleCategory = await this.articleCategoryRepository.remove(articleCategoryToDelete);
                return Methods.getJsonResponse(MapArticleCategory.inArticleCategoriesControllerDeleteAsync(deletedArticleCategory), "Delete operation was successful");
            } catch (error) {
                return Methods.getJsonResponse({}, error.toString(), false);
            }
        }
        return Methods.getJsonResponse({}, "Article Category was not found", false);
    }
}