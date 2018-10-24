import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Methods } from "../shared/methods"; import { ArticleCategory } from "../entities/ArticleCategory";
import { validate } from "class-validator";
import { FormResponse } from "../dto/classes/FormResponse";
import { IFormResponse } from "../dto/interfaces/IFormResponse";
import { MapArticleCategory } from "../mapping/mapArticleCategory";

export class ArticleCategoriesController {

    private articleCategoryRepository = getRepository(ArticleCategory);

    async createAsync(req: Request, resp: Response, next: NextFunction) {
        const articleCategory = req.body as ArticleCategory;

        // ------------------------------------------------------------------------
        // Validate Incoming Data
        // ------------------------------------------------------------------------
        const validationResult = await validate(articleCategory);
        if (validationResult.length > 0) {
            const invalidResponse = new FormResponse({
                isValid: false,
                errors: validationResult.map(e => e.toString())
            } as IFormResponse);
            return Methods.getJsonResponse(invalidResponse, "Article Category data provided was not valid", false);
        }

        // ------------------------------------------------------------------------
        // Check for existing Entity
        // ------------------------------------------------------------------------
        const existingArticleCategory = await this.articleCategoryRepository.findOne({ name: Methods.toCamelCase(articleCategory.title.replace(/[^a-zA-Z0-9\s\s+]/g, "")) });
        if (!!existingArticleCategory) {
            const invalidResponse = new FormResponse({
                isValid: false,
                errors: ["An article category with the same title already exists"]
            } as IFormResponse);
            return Methods.getJsonResponse(invalidResponse, "An article category with the same title already exists", false);
        }

        // ------------------------------------------------------------------------
        // Create New Entity
        // ------------------------------------------------------------------------
        const articleCategoryToCreate = new ArticleCategory();
        articleCategoryToCreate.title = articleCategory.title;

        const dbArticleCategory = await this.articleCategoryRepository.save(articleCategoryToCreate);
        const validResponse = new FormResponse<ArticleCategory>({
            isValid: true,
            target: MapArticleCategory.inArticleCategoriesControllerCreateAsync(dbArticleCategory)
        });
        return Methods.getJsonResponse(validResponse);
    }

    async updateAsync(req: Request, resp: Response, next: NextFunction) {
        const articleCategory = req.body as ArticleCategory;
        const validationResult = await validate(articleCategory);

        if (validationResult.length > 0) {
            const invalidResponse = new FormResponse({
                isValid: false,
                errors: validationResult.map(e => e.toString())
            } as IFormResponse);
            return Methods.getJsonResponse(invalidResponse, "Article Category data provided was not valid", false);
        }

        const existingArticleCategory = await this.articleCategoryRepository.findOne({ id: articleCategory.id });

        if (!existingArticleCategory) {
            Methods.sendErrorResponse(resp, 404, "Article Category was not found");
            return;
        }

        existingArticleCategory.title = articleCategory.title;

        const dbArticleCategory = await this.articleCategoryRepository.save(existingArticleCategory);
        const validResponse = new FormResponse<ArticleCategory>({
            isValid: true,
            target: MapArticleCategory.inArticleCategoriesControllerUpdateAsync(dbArticleCategory)
        });
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