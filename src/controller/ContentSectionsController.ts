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
		// Create New Entity
		// ------------------------------------------------------------------------

		const createdContentSection = await this.contentSectionRepository.save(contentSection);
		const validResponse = new FormResponse<ContentSection>({
			isValid: true,
			target: MapContentSection.inAllControllers(createdContentSection)
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
