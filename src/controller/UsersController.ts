import * as moment from "moment";
import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { User } from "../entities/User";
import { UserTypeEnum } from "../enums/UserTypeEnum";
import { MapUser } from "../mapping/mapUser";
import { Methods } from "../shared/methods";
import { MapCompany } from "../mapping/mapCompany";
import { UserService } from "../services/userService";
import { validate } from "class-validator";
import { FormResponse } from "../dto/classes/FormResponse";
import { IFormResponse } from "../dto/interfaces/IFormResponse";
import { Address } from "../entities/Address";
import { Media } from "../entities/Media";
import { Certificate } from "../entities/Certificate";
import { Experience } from "../entities/Experience";
import { Skill } from "../entities/Skill";
import { View } from "../entities/View";
import { Company } from "../entities/Company";

export class UsersController {
	private userRepository = getRepository(User);

	async getMembersAsync(req: Request, resp: Response, next: NextFunction) {
		const users = await this.userRepository.find({
			where: {
				type: UserTypeEnum.Member
			},
			order: {
				firstName: "ASC",
				lastName: "ASC"
			}
		});

		const response = users.map(u => MapUser.inAllControllers(u));

		return Methods.getJsonResponse(response, `${users.length} users found`);
	}

	async getVendorsAsync(req: Request, resp: Response, next: NextFunction) {
		const users = await this.userRepository
			.createQueryBuilder("user")
			.leftJoinAndSelect("user.company", "company")
			.leftJoinAndSelect("company.category", "category")
			.leftJoinAndSelect("company.address", "address")
			.leftJoinAndSelect("address.country", "country")
			.where("company.verified = :verified", { verified: true })
			.orderBy("user.createdDate", "DESC")
			.getMany();

		const response = users.map(u => MapCompany.inUsersControllerGetVendorsAsync(u.company));

		return Methods.getJsonResponse(response, `${users.length} vendors found`);
	}

	async getProfileLiteAsync(req: Request, resp: Response, next: NextFunction) {
		const me = await UserService.getAuthenticatedUserAsync(req);

		const thisWeekNumber = moment().isoWeek();
		me.views = me.views.filter(v => moment(v.createdDate).isoWeek() === thisWeekNumber);

		const response = MapUser.inUsersControllerGetProfileLiteAsync(me);

		return Methods.getJsonResponse(response);
	}

	async getSimilarProfilesAsync(req: Request, resp: Response, next: NextFunction) {
		const authUser = await UserService.getAuthenticatedUserAsync(req);

		if (authUser.type === UserTypeEnum.Admin) {
			Methods.sendErrorResponse(resp, 400, "Bad Request");
			return;
		}

		if (authUser.type === UserTypeEnum.Member) {
			let similarUsers = await this.userRepository.find({
				where: {
					type: UserTypeEnum.Member
				}
			});
			similarUsers = similarUsers.filter(x => x.id !== authUser.id && x.address.state === authUser.address.state);

			let response = Methods.randomlySelectFrom(similarUsers, 3).map(x => MapUser.inAllControllers(x));
			return Methods.getJsonResponse(response, `${similarUsers.length} members found`);
		} else {
			let similarCompanies = new Array<User>();
			if (!!authUser.company) {
				similarCompanies = await this.userRepository
					.createQueryBuilder("user")
					.where("user.id <> :authUserId", { authUserId: authUser.id })
					.where("user.company <> NULL")
					.leftJoinAndSelect("user.company", "company")
					.leftJoinAndSelect("company.category", "category")
					.leftJoinAndSelect("company.address", "address")
					.leftJoinAndSelect("address.country", "country")
					.where("category.id = :id", { id: authUser.company.category.id })
					.getMany();
			}

			let similarCompaniesUsers = Methods.randomlySelectFrom(similarCompanies.filter(x => x.id !== authUser.id), 3).map(x => {
				return {
					id: x.id,
					type: x.type,
					company: !!x.company ? MapCompany.inUsersControllerGetSimilarProfilesAsync(x.company) : null
				} as User;
			});
			return Methods.getJsonResponse(similarCompaniesUsers, `${similarCompaniesUsers.length} vendors found`);
		}
	}

	async getProfileAsync(req: Request, resp: Response, next: NextFunction) {
		const authUser = await UserService.getAuthenticatedUserAsync(req);

		if (authUser.type === UserTypeEnum.Member) {
			const response = MapUser.inUsersControllerGetProfileAsync(authUser);
			return Methods.getJsonResponse(response);
		} else {
			const { id, type, firstName, lastName, email, phone, company, cpdPoints } = authUser;
			const response = new User({
				id,
				type,
				cpdPoints,
				firstName,
				lastName,
				email,
				phone,
				company: !!company ? MapCompany.inUsersControllerGetProfileAsync(company) : null
			} as User);
			return Methods.getJsonResponse(response);
		}
	}

	async getByUrlTokenAsync(req: Request, resp: Response, next: NextFunction) {
		const urlToken = req.params.urlToken as string;
		const user = await this.userRepository.findOne({ urlToken });
		const authUserId = UserService.getAuthenticatedUserId(req);

		if (!user) {
			Methods.sendErrorResponse(resp, 404, "User was not found");
		}

		if (user.id !== authUserId) {
			const viewRepository = getRepository(View);
			const viewToCreate = new View({
				user: new User({ id: user.id }),
				viewedBy: new User({ id: UserService.getAuthenticatedUserId(req) })
			});
			await viewRepository.save(viewToCreate);
		}

		const response = MapUser.inUsersControllerGetByUrlTokenAsync(user);
		return Methods.getJsonResponse(response);
	}

	async updateAsync(req: Request, resp: Response, next: NextFunction) {
		const user = new User(req.body);
		const validationResult = await validate(user);

		if (validationResult.length > 0) {
			const invalidResponse = new FormResponse({
				isValid: false,
				errors: validationResult.map(e => e.constraints[Object.keys(e.constraints)[0]])
			} as IFormResponse);
			return Methods.getJsonResponse(invalidResponse, "User data provided was not valid", false);
		}

		const authUserId = UserService.getAuthenticatedUserId(req);
		const dbUser = await this.userRepository.findOne({ id: authUserId });

		const {
			firstName,
			lastName,
			address,
			phone,
			profilePhoto,
			certifications,
			facebookUrl,
			linkedInUrl,
			googlePlusUrl,
			twitterUrl,
			description,
			experiences,
			skills
		} = user;

		dbUser.firstName = firstName;
		dbUser.lastName = lastName;
		dbUser.phone = phone;
		dbUser.profilePhoto = !!profilePhoto ? new Media({ id: profilePhoto.id }) : null;
		dbUser.certifications = !!certifications ? certifications.map(x => new Certificate({ id: x.id })) : null;
		dbUser.facebookUrl = facebookUrl;
		dbUser.twitterUrl = twitterUrl;
		dbUser.googlePlusUrl = googlePlusUrl;
		dbUser.linkedInUrl = linkedInUrl;

		if (dbUser.type === UserTypeEnum.Member) {
			dbUser.description = description;
			dbUser.address = new Address(address);
		}

		dbUser.experiences = !!experiences ? experiences.map(x => new Experience({ id: x.id })) : null;
		dbUser.skills = !!skills ? skills.map(x => new Skill({ id: x.id })) : null;

		const updatedUser = await this.userRepository.save(dbUser);
		const validResponse = new FormResponse<User>({
			isValid: true,
			target: MapUser.inAllControllers(updatedUser)
		});
		return Methods.getJsonResponse(validResponse);
	}
}
