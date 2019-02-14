import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Methods } from "../shared/methods";
import { Company } from "../entities/Company";
import { MapCompany } from "../mapping/mapCompany";
import { View } from "../entities/View";
import { User } from "../entities/User";
import { UserService } from "../services/userService";
import { validate } from "class-validator";
import { FormResponse } from "../dto/classes/FormResponse";
import { IFormResponse } from "../dto/interfaces/IFormResponse";
import { Address } from "../entities/Address";
import { Category } from "../entities/Category";
import { Product } from "../entities/Product";
import { Media } from "../entities/Media";
import { Country } from "../entities/Country";
import { Notification } from "../entities/Notification";
import { NotificationTypeEnum } from "../enums/NotificationTypeEnum";
import { NotificationService } from "../services/notificationService";
import { UserTypeEnum } from "../enums/UserTypeEnum";

export class CompaniesController {
	private companyRepository = getRepository(Company);
	private countryRepository = getRepository(Country);
	private mediaRepository = getRepository(Media);

	async getByUrlTokenAsync(req: Request, resp: Response, next: NextFunction) {
		const urlToken = req.params.urlToken as string;
		const company = await this.companyRepository
			.createQueryBuilder("company")
			.leftJoinAndSelect("company.user", "user")
			.leftJoinAndSelect("company.address", "address")
			.leftJoinAndSelect("address.country", "country")
			.leftJoinAndSelect("company.category", "category")
			.leftJoinAndSelect("company.products", "product")
			.leftJoinAndSelect("company.documents", "document")
			.where("company.urlToken = :urlToken", { urlToken })
			.getOne();

		if (!company) {
			Methods.sendErrorResponse(resp, 404, "Vendor was not found");
			return;
		}
		const authUser = await UserService.getAuthenticatedUserAsync(req);
		const viewRepository = getRepository(View);
		const viewToCreate = new View({
			user: new User({ id: company.user.id }),
			viewedBy: new User({ id: authUser.id })
		});
		await viewRepository.save(viewToCreate);

		if (authUser.type !== UserTypeEnum.Admin) {
			company.documents === null;
		}

		const response = MapCompany.inCompaniesControllerGetByUrlTokenAsync(company);
		return Methods.getJsonResponse(response);
	}

	async createAsync(req: Request, resp: Response, next: NextFunction) {
		const company = new Company(req.body);

		// ------------------------------------------------------------------------
		// Validate the data
		// ------------------------------------------------------------------------

		const validationResult = await validate(company);
		if (validationResult.length > 0) {
			const invalidResponse = new FormResponse({
				isValid: false,
				errors: validationResult.map(e => e.constraints[Object.keys(e.constraints)[0]])
			} as IFormResponse);
			return Methods.getJsonResponse(invalidResponse, "Vendor data provided was not valid", false);
		}

		// ------------------------------------------------------------------------
		// Check for existing Entity
		// ------------------------------------------------------------------------

		const urlToken = company.name.toLowerCase().replace(/[^a-z]/g, "");
		const dbCompany = await this.companyRepository.findOne({ urlToken });
		if (!!dbCompany) {
			const invalidResponse = new FormResponse({
				isValid: false,
				errors: ["A vendor with the same name already exists"]
			} as IFormResponse);
			return Methods.getJsonResponse(invalidResponse, "A vendor with the same name already exists", false);
		}

		// ------------------------------------------------------------------------
		// Create New Entity
		// ------------------------------------------------------------------------

		const {
			name,
			logoUrl,
			address,
			phone,
			website,
			email,
			backgroundCheck,
			noBackgroundCheckReason,
			registrationType,
			registrationDate,
			registrationNumber,
			vatRegistrationNumber,
			taxpayersIdentificationNumber,
			averageAnnualContractValue,
			highestSingularContractValue,
			productsDescription,
			category,
			products,
			documents
		} = company;
		const authUserId = UserService.getAuthenticatedUserId(req);

		const companyToCreate = new Company({
			name,
			logoUrl,
			phone,
			website,
			email,
			backgroundCheck,
			noBackgroundCheckReason,
			registrationType,
			registrationDate,
			registrationNumber,
			vatRegistrationNumber,
			taxpayersIdentificationNumber,
			averageAnnualContractValue,
			highestSingularContractValue,
			productsDescription,
			verified: false,
			address: new Address({
				addressLine1: address.addressLine1,
				city: address.city,
				state: address.state
				// country: new Country({ id: address.country.id })
			}),
			user: new User({ id: authUserId }),
			category: new Category({ id: category.id }),
			products: products.map(x => new Product({ id: x.id })),
			documents: !!documents ? documents.map(x => new Media(x)) : null
		});

		const defaultCountry = await this.countryRepository.findOne({ isDefault: true });
		companyToCreate.address.country = new Country({ id: defaultCountry.id });

		const createdCompany = await this.companyRepository.save(companyToCreate);
		const validResponse = new FormResponse<Company>({
			isValid: true,
			target: MapCompany.inUsersControllerCreateAsync(createdCompany)
		});
		return Methods.getJsonResponse(validResponse);
	}

	async updateAsync(req: Request, resp: Response, next: NextFunction) {
		const company = new Company(req.body);
		const validationResult = await validate(company);

		if (validationResult.length > 0) {
			const invalidResponse = new FormResponse({
				isValid: false,
				errors: validationResult.map(e => e.constraints[Object.keys(e.constraints)[0]])
			} as IFormResponse);
			return Methods.getJsonResponse(invalidResponse, "Vendor data provided was not valid", false);
		}

		const authUser = await UserService.getAuthenticatedUserAsync(req);
		const dbCompany = await this.companyRepository.findOne({ id: company.id });

		if (!dbCompany) {
			Methods.sendErrorResponse(resp, 404, "Vendor was not found");
		}

		if (authUser.company.id !== dbCompany.id) {
			Methods.sendErrorResponse(resp, 400);
			return;
		}

		const { name, logoUrl, address, phone, website, email, registrationDate, registrationNumber, registrationType, productsDescription } = company;

		dbCompany.name = name;
		dbCompany.logoUrl = logoUrl;
		dbCompany.address = new Address({ id: address.id, country: new Country({ id: address.country.id }) });
		dbCompany.phone = phone;
		dbCompany.website = website;
		dbCompany.email = email;
		dbCompany.registrationDate = registrationDate;
		dbCompany.registrationNumber = registrationNumber;
		dbCompany.registrationType = registrationType;
		dbCompany.productsDescription = productsDescription;

		await this.companyRepository.update(dbCompany.id, {
			name,
			logoUrl,
			address,
			phone,
			website,
			email,
			registrationDate,
			registrationNumber,
			registrationType,
			productsDescription
		});
		const validResponse = new FormResponse<Company>({
			isValid: true,
			target: MapCompany.inUsersControllerUpdateAsync(dbCompany)
		});
		return Methods.getJsonResponse(validResponse);
	}

	async verifyAsync(req: Request, resp: Response, next: NextFunction) {
		const id = req.params.id as string;
		// const company = await this.companyRepository.findOne(id);
		const company = await this.companyRepository
			.createQueryBuilder("company")
			.leftJoinAndSelect("company.user", "user")
			.leftJoinAndSelect("company.address", "address")
			.leftJoinAndSelect("address.country", "country")
			.leftJoinAndSelect("company.category", "category")
			.leftJoinAndSelect("company.products", "product")
			.leftJoinAndSelect("company.documents", "documents")
			.where("company.id = :id", { id })
			.getOne();

		if (!company) {
			Methods.sendErrorResponse(resp, 404, "Vendor was not found");
			return;
		}

		if (company.verified) {
			Methods.sendErrorResponse(resp, 400, "Vendor has already been verified");
			return;
		}

		company.verified = true;

		const verifiedCompany = await this.companyRepository.save(company);
		const response = MapCompany.inUsersControllerVerifyAsync(verifiedCompany);

		const notification = new Notification({
			user: new User({ id: company.user.id }),
			content: `Your organization, ${company.name} has been successfully verified! Your profile will now be available to other members of the network!`,
			type: NotificationTypeEnum.VerificationSuccess,
			hasBeenRead: false
		} as Notification);

		try {
			await NotificationService.sendNotificationAsync(req, notification);
		} catch (error) {}

		return Methods.getJsonResponse(response, "Vendor was successfully verified");
	}
}
