import { getRepository } from "typeorm";
import { Ad } from "../entities/Ad";
import { Request, Response, NextFunction } from "express";
import { MapAd } from "../mapping/mapAd";
import { Methods } from "../shared/methods";
import { validate } from "class-validator";
import { FormResponse } from "../dto/classes/FormResponse";
import { IFormResponse } from "../dto/interfaces/IFormResponse";
import { Media } from "../entities/Media";
import { CacheService } from "../services/cacheService";
import { Constants } from "../shared/constants";
import { LogService } from "../services/logService";
import { LogTypeEnum } from "../enums/LogTypeEnum";

export class AdsController {
	private adRepository = getRepository(Ad);

	async createAsync(req: Request, resp: Response, next: NextFunction) {
		const ad = new Ad(req.body);

		// ------------------------------------------------------------------------
		// Validate the data
		// ------------------------------------------------------------------------

		const validationResult = await validate(ad);
		if (validationResult.length > 0) {
			const invalidResponse = new FormResponse({
				isValid: false,
				errors: validationResult.map(e => e.constraints[Object.keys(e.constraints)[0]])
			} as IFormResponse);
			return Methods.getJsonResponse(invalidResponse, "Ad data provided was not valid", false);
		}

		// ------------------------------------------------------------------------
		// Create New Entity
		// ------------------------------------------------------------------------

		const { media } = ad;

		const adToCreate = new Ad({
			media: new Media({ id: media.id })
		});

		const createdAd = await this.adRepository.save(adToCreate);
		const validResponse = new FormResponse<Ad>({
			isValid: true,
			target: MapAd.inAllControllers(createdAd)
		});
		CacheService.invalidateCacheItem(Constants.sortedTimelinePosts);
		return Methods.getJsonResponse(validResponse);
	}

	async getAsync(req: Request, resp: Response, next: NextFunction) {
		const number = req.params.number;
		const ads = await this.adRepository
			.createQueryBuilder("ad")
			.leftJoinAndSelect("ad.media", "media")
			.orderBy("RAND()")
			.take(number)
			.getMany();

		const response = ads.map(a => MapAd.inAllControllers(a));

		return Methods.getJsonResponse(response);
	}

	async getAllAsync(req: Request, resp: Response, next: NextFunction) {
		const ads = await this.adRepository.find({
			order: {
				createdDate: "DESC"
			}
		});

		const response = ads.map(a => MapAd.inAllControllers(a));

		return Methods.getJsonResponse(response);
	}

	async registerClickAsync(req: Request, resp: Response, next: NextFunction) {
		const id = req.params.id;
		const dbAd = await this.adRepository.findOne({ id });

		if (!dbAd) {
			Methods.sendErrorResponse(resp, 404, "Ad was not found");
			return;
		}

		dbAd.clickCount = dbAd.clickCount + 1;

		await this.adRepository.save(dbAd);

		return Methods.getJsonResponse(null, "", true);
	}

	async deleteAsync(req: Request, resp: Response, next: NextFunction) {
		const adToDelete = await this.adRepository.findOne(req.params.id);

		if (!!adToDelete) {
			try {
				const deletedAd = await this.adRepository.remove(adToDelete);
				return Methods.getJsonResponse(MapAd.inAllControllers(deletedAd), "Delete operation was successful");
			} catch (error) {
				await LogService.log(req, "An error occured while deleting an Ad.", error.toString(), LogTypeEnum.Exception);
				return Methods.getJsonResponse({}, error.toString(), false);
			}
		}
	}
}
