import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { Category } from "../entities/Category";
import { validate } from "class-validator";
import { FormResponse } from "../dto/classes/FormResponse";
import { IFormResponse } from "../dto/interfaces/IFormResponse";
import { Methods } from "../shared/methods";
import { MapCategory } from "../mapping/mapCategory";

export class CategoriesController {

    private categoryRepository = getRepository(Category);

    async createAsync(req: Request, resp: Response, next: NextFunction) {
        const category = new Category(req.body);

        // ------------------------------------------------------------------------
        // Validate the data
        // ------------------------------------------------------------------------
        const validationResult = await validate(category);
        if (validationResult.length > 0) {
            const invalidResponse = new FormResponse({
                isValid: false,
                errors: validationResult.map(e => e.toString())
            } as IFormResponse);
            return Methods.getJsonResponse(invalidResponse, "Category data provided was not valid", false);
        }

        // ------------------------------------------------------------------------
        // Check for existing Entity
        // ------------------------------------------------------------------------
        const dbCategory = await this.categoryRepository.findOne({ name: Methods.toCamelCase(category.title.replace(/[^a-zA-Z0-9\s\s+]/g, "")) });
        if (!!dbCategory) {
            const invalidResponse = new FormResponse({
                isValid: false,
                errors: ["A category with the same title already exists"]
            } as IFormResponse);
            return Methods.getJsonResponse(invalidResponse, "A category with the same title already exists", false);
        }

        // ------------------------------------------------------------------------
        // Create New Entity
        // ------------------------------------------------------------------------
        const categoryToCreate = new Category({
            title: category.title
        });

        const createdCategory = await this.categoryRepository.save(categoryToCreate);
        const validResponse = new FormResponse<Category>({
            isValid: true,
            target: MapCategory.inCategoriesControllerCreateAsync(createdCategory)
        });
        return Methods.getJsonResponse(validResponse);
    }

    async updateAsync(req: Request, resp: Response, next: NextFunction) {
        const category = new Category(req.body);
        const validationResult = await validate(category);

        if (validationResult.length > 0) {
            const invalidResponse = new FormResponse({
                isValid: false,
                errors: validationResult.map(e => e.toString())
            } as IFormResponse);
            return Methods.getJsonResponse(invalidResponse, "Category data provided was not valid", false);
        }

        const dbCategory = await this.categoryRepository.findOne({ id: category.id });

        if (!dbCategory) {
            Methods.sendErrorResponse(resp, 404, "Category was not found");
            return;
        }

        dbCategory.title = category.title;

        const updatedCategory = await this.categoryRepository.save(dbCategory);
        const validResponse = new FormResponse<Category>({
            isValid: true,
            target: MapCategory.inCategoriesControllerUpdateAsync(updatedCategory)
        });
        return Methods.getJsonResponse(validResponse);
    }

    async deleteAsync(req: Request, resp: Response, next: NextFunction) {
        const categoryToDelete = await this.categoryRepository.findOne(req.params.id);

        if (!!categoryToDelete) {
            try {
                const deletedCategory = await this.categoryRepository.remove(categoryToDelete);
                return Methods.getJsonResponse(MapCategory.inCategoriesControllerDeleteAsync(deletedCategory), "Delete operation was successful");
            } catch (error) {
                return Methods.getJsonResponse({}, error.toString(), false);
            }
        }
        Methods.sendErrorResponse(resp, 404, "Category was not found");
    }
}