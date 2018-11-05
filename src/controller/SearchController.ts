import { NextFunction, Request, Response } from "express";
import { User } from "../entities/User";
import { getRepository } from "typeorm";
import { Constants } from "../shared/constants";
import { Methods } from "../shared/methods";
import { Company } from "../entities/Company";
import { UserTypeEnum } from "../enums/UserTypeEnum";
import { MapUser } from "../mapping/mapUser";
import { MapCompany } from "../mapping/mapCompany";
import { ISearchResults } from "../dto/interfaces/ISearchResults";
import { Address } from "../entities/Address";

export class SearchController {
	private userRepository = getRepository(User);
	private companyRepository = getRepository(Company);
	private addressRepository = getRepository(Address);

	async getLocationsAsync(req: Request, resp: Response, next: NextFunction) {
		const addresses = await this.addressRepository.find();
		const response = addresses.map(x => `${x.state}, ${x.country.name}`).filter((x, i, s) => s.indexOf(x) === i);

		return Methods.getJsonResponse(response, `${response.length} location(s) found`);
	}

	async searchAsync(req: Request, resp: Response, next: NextFunction) {
		const { params } = req;
		const type = +params.type as UserTypeEnum;
		const category = params.category as string;
		const location = params.location as string;
		let users = new Array<User>();
		let companies = new Array<Company>();

		if (type === UserTypeEnum.Member) {
			let dbUsers = await this.userRepository.find({
				where: {
					type: UserTypeEnum.Member
				}
			});

			if (dbUsers.length > 0 && location !== Constants.locationEverywhere) {
				const state = location.split(",")[0];
				const countryName = location.split(",")[1];
				dbUsers = dbUsers.filter(
					u =>
						!!u.address &&
						Methods.includesSubstring(u.address.state, state, true) &&
						Methods.includesSubstring(u.address.country.name, countryName, true)
				);
			}

			users = dbUsers.map(u => MapUser.inSearchControllerSearchAsync(u));
		}

		if (type === UserTypeEnum.Vendor) {
			let dbCompanies = await this.companyRepository.find();

			if (dbCompanies.length > 0 && category !== Constants.categoryAll) {
				dbCompanies = dbCompanies.filter(c => c.category.name === category);
			}

			companies = dbCompanies.map(c => MapCompany.inSearchControllerSearchAsync(c));
		}

		const response = {
			users,
			companies
		} as ISearchResults;

		return Methods.getJsonResponse(response, `${users.length} member(s) and ${companies.length} vendor(s) found`);
	}
}
