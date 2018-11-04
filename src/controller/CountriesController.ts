import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Country } from "../entities/Country";

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
}
