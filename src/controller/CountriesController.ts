import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Country } from "../entities/Country";
import { MapCountry } from "../mapping/mapCountry";
import { Methods } from "../shared/methods";
import RawCountries from "../shared/rawcountries";

export class CountriesController {
	private countryRepository = getRepository(Country);

	async seedAsync(req: Request, resp: Response, next: NextFunction) {
		const countryEntities = RawCountries.map(
			c =>
				new Country({
					name: c.country,
					states: c.states.join(",,")
				} as Country)
		);
		countryEntities[countryEntities.findIndex(c => c.name === "Nigeria")].isDefault = true;
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
