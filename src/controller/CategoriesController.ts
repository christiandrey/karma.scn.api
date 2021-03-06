import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { Category } from "../entities/Category";
import { validate } from "class-validator";
import { FormResponse } from "../dto/classes/FormResponse";
import { IFormResponse } from "../dto/interfaces/IFormResponse";
import { Methods } from "../shared/methods";
import { MapCategory } from "../mapping/mapCategory";
import { LogService } from "../services/logService";
import { LogTypeEnum } from "../enums/LogTypeEnum";

export class CategoriesController {
	private categoryRepository = getRepository(Category);

	async getAllAsync(req: Request, resp: Response, next: NextFunction) {
		const categories = await this.categoryRepository
			.createQueryBuilder("category")
			.leftJoinAndSelect("category.products", "product")
			.orderBy("category.title", "ASC")
			.getMany();

		const response = categories.map(x => MapCategory.inAllControllers(x));

		return Methods.getJsonResponse(response, `${categories.length} categories found`);
	}

	async createAsync(req: Request, resp: Response, next: NextFunction) {
		const category = new Category(req.body);

		// ------------------------------------------------------------------------
		// Validate the data
		// ------------------------------------------------------------------------
		const validationResult = await validate(category);
		if (validationResult.length > 0) {
			const invalidResponse = new FormResponse({
				isValid: false,
				errors: validationResult.map(e => e.constraints[Object.keys(e.constraints)[0]])
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
				errors: validationResult.map(e => e.constraints[Object.keys(e.constraints)[0]])
			} as IFormResponse);
			return Methods.getJsonResponse(invalidResponse, "Category data provided was not valid", false);
		}

		// ------------------------------------------------------------------------
		// Check for existing Entity with same title
		// ------------------------------------------------------------------------
		const existingDbCategory = await this.categoryRepository.findOne({ name: Methods.toCamelCase(category.title.replace(/[^a-zA-Z0-9\s\s+]/g, "")) });
		if (!!existingDbCategory && existingDbCategory.id !== category.id) {
			const invalidResponse = new FormResponse({
				isValid: false,
				errors: ["A category with the same title already exists"]
			} as IFormResponse);
			return Methods.getJsonResponse(invalidResponse, "A category with the same title already exists", false);
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
		const categoryToDelete = await this.categoryRepository
			.createQueryBuilder("category")
			.where("category.id = :id", { id: req.params.id })
			.leftJoinAndSelect("category.products", "product")
			.getOne();

		if (!!categoryToDelete) {
			if (categoryToDelete.products.length > 0) {
				Methods.sendErrorResponse(
					resp,
					400,
					"There are products attached to this category. Please either delete these products manually or assign them to a different category."
				);
				return;
			}

			try {
				const deletedCategory = await this.categoryRepository.remove(categoryToDelete);
				return Methods.getJsonResponse(MapCategory.inCategoriesControllerDeleteAsync(deletedCategory), "Delete operation was successful");
			} catch (error) {
				await LogService.log(req, `An error occured while deleting the '${categoryToDelete.title}' category.`, error.toString(), LogTypeEnum.Exception);
				return Methods.getJsonResponse({}, error.toString(), false);
			}
			// try {
			// 	await this.categoryRepository.delete(categoryToDelete.id);
			// 	return Methods.getJsonResponse(MapCategory.inCategoriesControllerDeleteAsync(categoryToDelete), "Delete operation was successful");
			// } catch (error) {
			// 	return Methods.getJsonResponse({}, error.toString(), false);
			// }
		}
		Methods.sendErrorResponse(resp, 404, "Category was not found");
	}
}
