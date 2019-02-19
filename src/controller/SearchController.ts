import { NextFunction, Request, Response } from "express";
import { User } from "../entities/User";
import { getRepository } from "typeorm";
import { Methods } from "../shared/methods";
import { UserTypeEnum } from "../enums/UserTypeEnum";
import { MapUser } from "../mapping/mapUser";
import { ISearchResults } from "../dto/interfaces/ISearchResults";
import { Address } from "../entities/Address";
import { ISearchRequest } from "../dto/interfaces/ISearchRequest";
import { Constants } from "../shared/constants";
import { SendEmailConfig } from "../dto/classes/SendEmailConfig";
import { EmailService } from "../services/emailService";

export class SearchController {
	private userRepository = getRepository(User);
	private addressRepository = getRepository(Address);

	async getLocationsAsync(req: Request, resp: Response, next: NextFunction) {
		const addresses = await this.addressRepository.find();
		const response = addresses.map(x => `${x.state}, ${x.country.name}`).filter((x, i, s) => s.indexOf(x) === i);

		const sendEmailConfig = {
			to: "oluwaseun.adedire@gmail.com",
			subject: "Welcome to the Supply Chain Network",
			heading: "Hey Oluwaseun,",
			body: Constants.welcomeEmailContent
		} as SendEmailConfig;

		await EmailService.sendEmailAsync(req, sendEmailConfig);

		return Methods.getJsonResponse(response, `${response.length} location(s) found`);
	}

	async searchAsync(req: Request, resp: Response, next: NextFunction) {
		const searchRequest = req.body as ISearchRequest;
		const { type, category, product, location, query } = searchRequest;

		let members = new Array<User>();
		let vendors = new Array<User>();

		if (type == undefined || type === null) {
			if (!category && !product) {
				members = await this.findMembers(location, query);
			}
			vendors = await this.findVendors(category, product, location, query);
		}

		if (type === UserTypeEnum.Member) {
			members = await this.findMembers(location, query);
		}

		if (type === UserTypeEnum.Vendor) {
			vendors = await this.findVendors(category, product, location, query);
		}

		const response = {
			members: members.map(x => MapUser.inAllControllers(x)),
			vendors: vendors.map(x => MapUser.inAllControllers(x))
		} as ISearchResults;

		return Methods.getJsonResponse(response, `${members.length} member(s) and ${vendors.length} vendor(s) found`);
	}

	private async findMembers(location?: string, query?: string): Promise<Array<User>> {
		let dbQuery = this.userRepository.createQueryBuilder("user").where("user.type = :type", { type: UserTypeEnum.Member });

		if (query) {
			const sanitizedQuery = query
				.toLowerCase()
				.replace(/\s{2,}/g, "")
				.replace(/[^a-zA-Z0-9\s]/g, "");
			dbQuery = dbQuery.andWhere("CONCAT(user.firstName, ' ', user.lastName) LIKE :query", { query: `%${sanitizedQuery}%` });
		}

		let users = await dbQuery
			.leftJoinAndSelect("user.profilePhoto", "profilePhoto")
			.leftJoinAndSelect("user.views", "view")
			.leftJoinAndSelect("user.address", "address")
			.leftJoinAndSelect("address.country", "country")
			.take(10)
			.getMany();

		if (!location) return Promise.resolve(users);

		const state = location.split(",")[0] || "";
		const countryName = location.split(",")[1] || "";

		users = users.filter(
			u => !!u.address && Methods.includesSubstring(u.address.state, state, true) && Methods.includesSubstring(u.address.country.name, countryName, true)
		);

		return Promise.resolve(users);
	}

	private async findVendors(category?: string, product?: string, location?: string, query?: string): Promise<Array<User>> {
		let dbQuery = this.userRepository
			.createQueryBuilder("user")
			.where("user.type = :type", { type: UserTypeEnum.Vendor })
			.andWhere("user.company IS NOT NULL")
			.leftJoinAndSelect("user.views", "view")
			.leftJoinAndSelect("user.company", "company")
			.leftJoinAndSelect("company.category", "category")
			.leftJoinAndSelect("company.products", "products");

		if (query) {
			const sanitizedQuery = query
				.toLowerCase()
				.replace(/\s{2,}/g, "")
				.replace(/[^a-zA-Z0-9\s]/g, "");
			dbQuery = dbQuery.andWhere("company.name LIKE :name", { name: `%${sanitizedQuery}%` });
		}

		if (category) {
			dbQuery = dbQuery.andWhere("category.name = :category", { category });
		}

		let vendors = await dbQuery
			.leftJoinAndSelect("company.address", "address")
			.leftJoinAndSelect("address.country", "country")
			.take(10)
			.getMany();

		if (product) {
			vendors = vendors.filter(x => x.company.products.find(p => p.name === product));
		}

		if (!location) return Promise.resolve(vendors);

		const state = location.split(",")[0] || "";
		const countryName = location.split(",")[1] || "";

		vendors = vendors.filter(
			u =>
				!!u.company.address &&
				Methods.includesSubstring(u.company.address.state, state, true) &&
				Methods.includesSubstring(u.company.address.country.name, countryName, true)
		);

		return Promise.resolve(vendors);
	}
}
