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

    async createAsync(request: Request, response: Response, next: NextFunction) {
        const category = request.body as Category;
        const validationResult = await validate(category);

        if (validationResult.length > 0) {
            const invalidResponse = new FormResponse({
                isValid: false,
                errors: validationResult.map(e => e.toString())
            } as IFormResponse);
            return Methods.getJsonResponse(invalidResponse, "Category data provided was not valid", false);
        }

        const categoryToCreate = new Category();
        categoryToCreate.title = category.title;

        const dbCategory = await this.categoryRepository.save(category);
        const validResponse = new FormResponse<Category>({
            isValid: true,
            target: MapCategory.inCategoriesControllerCreateAsync(dbCategory)
        });
        return Methods.getJsonResponse(validResponse);
    }

    async updateAsync(request: Request, response: Response, next: NextFunction) {
        const category = request.body as Category;
        const validationResult = await validate(category);

        if (validationResult.length > 0) {
            const invalidResponse = new FormResponse({
                isValid: false,
                errors: validationResult.map(e => e.toString())
            } as IFormResponse);
            return Methods.getJsonResponse(invalidResponse, "Category data provided was not valid", false);
        }

        const existingCategory = await this.categoryRepository.findOne({
            where: {
                id: category.id
            }
        });

        if (!existingCategory) {
            const invalidResponse = new FormResponse({
                isValid: false,
                errors: ["Category was not found"]
            } as IFormResponse);
            return Methods.getJsonResponse(invalidResponse, "Category was not found", false);
        }

        existingCategory.title = category.title;

        const dbCategory = await this.categoryRepository.save(category);
        const validResponse = new FormResponse<Category>({
            isValid: true,
            target: MapCategory.inCategoriesControllerUpdateAsync(dbCategory)
        });
        return Methods.getJsonResponse(validResponse);
    }

    async deleteAsync(request: Request, response: Response, next: NextFunction) {
        const categoryToDelete = await this.categoryRepository.findOne(request.params.id);

        if (!!categoryToDelete) {
            try {
                const deletedCategory = await this.categoryRepository.remove(categoryToDelete);
                return Methods.getJsonResponse(MapCategory.inCategoriesControllerDeleteAsync(deletedCategory), "Delete operation was successful");
            } catch (error) {
                return Methods.getJsonResponse({}, error.toString(), false);
            }
        }
        return Methods.getJsonResponse({}, "Category was not found", false);
    }
}