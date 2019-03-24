import { getRepository, In } from "typeorm";
import { ContentSection } from "../entities/ContentSection";
import { Request, Response, NextFunction } from "express";
import { FormResponse } from "../dto/classes/FormResponse";
import { validate } from "class-validator";
import { IFormResponse } from "../dto/interfaces/IFormResponse";
import { Methods } from "../shared/methods";
import { MapContentSection } from "../mapping/mapContentSection";
import { LogTypeEnum } from "../enums/LogTypeEnum";
import { LogService } from "../services/logService";

export class ContentSectionsController {
	private contentSectionRepository = getRepository(ContentSection);

	async createAsync(req: Request, resp: Response, next: NextFunction) {
		const contentSection = new ContentSection(req.body);

		// ------------------------------------------------------------------------
		// Validate the data
		// ------------------------------------------------------------------------

		const validationResult = await validate(contentSection);
		if (validationResult.length > 0) {
			const invalidResponse = new FormResponse({
				isValid: false,
				errors: validationResult.map(e => e.constraints[Object.keys(e.constraints)[0]])
			} as IFormResponse);
			return Methods.getJsonResponse(invalidResponse, "Content Section data provided was not valid", false);
		}

		// ------------------------------------------------------------------------
		// Check for existing entity
		// ------------------------------------------------------------------------

		const dbContentSection = await this.contentSectionRepository.findOne({ title: contentSection.title });

		if (!!dbContentSection) {
			const invalidResponse = new FormResponse({
				isValid: false,
				errors: ["A content with the same title already exists"]
			} as IFormResponse);
			return Methods.getJsonResponse(invalidResponse, "A content with the same title already exists", false);
		}

		// ------------------------------------------------------------------------
		// Create New Entity
		// ------------------------------------------------------------------------

		const createdContentSection = await this.contentSectionRepository.save(contentSection);
		const validResponse = new FormResponse<ContentSection>({
			isValid: true,
			target: MapContentSection.inAllControllers(createdContentSection)
		});

		return Methods.getJsonResponse(validResponse);
	}

	async updateAsync(req: Request, resp: Response, next: NextFunction) {
		const contentSection = new ContentSection(req.body);
		const validationResult = await validate(contentSection);

		if (validationResult.length > 0) {
			const invalidResponse = new FormResponse({
				isValid: false,
				errors: validationResult.map(e => e.constraints[Object.keys(e.constraints)[0]])
			} as IFormResponse);
			return Methods.getJsonResponse(invalidResponse, "Content section data provided was not valid", false);
		}

		// ------------------------------------------------------------------------
		// Check for existing entity with same title
		// ------------------------------------------------------------------------

		const existingContentSection = await this.contentSectionRepository.findOne({ title: contentSection.title });

		if (!!existingContentSection && existingContentSection.id !== contentSection.id) {
			const invalidResponse = new FormResponse({
				isValid: false,
				errors: ["A content section with the same title already exists"]
			} as IFormResponse);
			return Methods.getJsonResponse(invalidResponse, "A product with the same title already exists", false);
		}

		const dbContentSection = await this.contentSectionRepository.findOne({ id: contentSection.id });

		if (!dbContentSection) {
			Methods.sendErrorResponse(resp, 404, "Content Section was not found");
			return;
		}

		dbContentSection.title = contentSection.title;

		const updatedContentSection = await this.contentSectionRepository.save(dbContentSection);
		const validResponse = new FormResponse<ContentSection>({
			isValid: true,
			target: MapContentSection.inAllControllers(updatedContentSection)
		});
		return Methods.getJsonResponse(validResponse);
	}

	async getAsync(req: Request, resp: Response, next: NextFunction) {
		const contentSectionTitles = req.body as Array<string>;
		const contentSections = await this.contentSectionRepository.find({
			title: In(contentSectionTitles)
		});

		const response = contentSections.map(c => MapContentSection.inAllControllers(c));

		return Methods.getJsonResponse(response);
	}

	async getAllAsync(req: Request, resp: Response, next: NextFunction) {
		const contentSections = await this.contentSectionRepository.find({
			order: {
				title: "ASC"
			}
		});

		const response = contentSections.map(c => MapContentSection.inAllControllers(c));

		return Methods.getJsonResponse(response);
	}

	async deleteAsync(req: Request, resp: Response, next: NextFunction) {
		const contentSectionToDelete = await this.contentSectionRepository.findOne(req.params.id);

		if (!!contentSectionToDelete) {
			try {
				const contentSectionAd = await this.contentSectionRepository.remove(contentSectionToDelete);
				return Methods.getJsonResponse(MapContentSection.inAllControllers(contentSectionAd), "Delete operation was successful");
			} catch (error) {
				await LogService.log(req, "An error occured while deleting an Content Section.", error.toString(), LogTypeEnum.Exception);
				return Methods.getJsonResponse({}, error.toString(), false);
			}
		}
	}
}
