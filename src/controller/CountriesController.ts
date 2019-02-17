import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Country } from "../entities/Country";
import { MapCountry } from "../mapping/mapCountry";
import { Methods } from "../shared/methods";

export class CountriesController {
	private countryRepository = getRepository(Country);

	async seedAsync(req: Request, resp: Response, next: NextFunction) {
		const countries = ["Nigeria", "United Kingdom"];
		const countryEntities = countries.map(
			c =>
				new Country({
					name: c
				} as Country)
		);
		countryEntities[0].isDefault = true;
		return await this.countryRepository.save(countryEntities);
	}

	async getAllAsync(req: Request, resp: Response, next: NextFunction) {
		const countries = await this.countryRepository.find({
			order: {
				name: "ASC"
			}
		});

		const response = countries.map(x => MapCountry.inAllControllers(x));

		return Methods.getJsonResponse(response, `${countries.length} countries found`);
	}
}
