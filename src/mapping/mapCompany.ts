import { Company } from "../entities/Company";
import { Product } from "../entities/Product";
import { MapProduct } from "./mapProduct";
import { MapCategory } from "./mapCategory";
import { MapAddress } from "./mapAddress";
import { User } from "../entities/User";

export namespace MapCompany {
	export function inSearchControllerSearchAsync(company: Company): Company {
		return {
			id: company.id,
			urlToken: company.urlToken,
			logoUrl: company.logoUrl,
			name: company.name,
			category: MapCategory.inAllControllers(company.category),
			products: company.products.length > 0 ? company.products.map(p => MapProduct.inAllControllers(p)) : new Array<Product>()
		} as Company;
	}

	export function inUsersControllerGetVendorsAsync(company: Company): Company {
		return {
			id: company.id,
			urlToken: company.urlToken,
			logoUrl: company.logoUrl,
			name: company.name,
			verified: company.verified,
			category: MapCategory.inAllControllers(company.category)
		} as Company;
	}

	export function inUsersControllerGetSimilarProfilesAsync(company: Company): Company {
		const { id, name, logoUrl, address, urlToken } = company;
		return {
			id,
			name,
			logoUrl,
			urlToken,
			address: MapAddress.inAllControllers(address)
		} as Company;
	}

	export function inUsersControllerGetProfileAsync(company: Company): Company {
		const {
			id,
			name,
			verified,
			urlToken,
			logoUrl,
			postalBox,
			address,
			phone,
			website,
			email,
			registrationDate,
			registrationNumber,
			registrationType,
			productsDescription,
			taxpayersIdentificationNumber,
			vatRegistrationNumber,
			averageAnnualContractValue,
			highestSingularContractValue,
			category,
			products
		} = company;
		return {
			id,
			name,
			verified,
			urlToken,
			logoUrl,
			postalBox,
			phone,
			website,
			email,
			registrationDate,
			registrationNumber,
			registrationType,
			productsDescription,
			taxpayersIdentificationNumber,
			vatRegistrationNumber,
			averageAnnualContractValue,
			highestSingularContractValue,
			address: MapAddress.inAllControllers(address),
			category: MapCategory.inAllControllers(category),
			products: !!products ? products.map(x => MapProduct.inAllControllers(x)) : new Array<Product>()
		} as Company;
	}

	export function inCompaniesControllerGetByUrlTokenAsync(company: Company): Company {
		const {
			id,
			name,
			verified,
			urlToken,
			logoUrl,
			postalBox,
			address,
			phone,
			website,
			email,
			registrationDate,
			registrationNumber,
			registrationType,
			productsDescription,
			taxpayersIdentificationNumber,
			vatRegistrationNumber,
			averageAnnualContractValue,
			highestSingularContractValue,
			category,
			products,
			user
		} = company;
		return {
			id,
			name,
			verified,
			urlToken,
			logoUrl,
			postalBox,
			phone,
			website,
			email,
			registrationDate,
			registrationNumber,
			registrationType,
			productsDescription,
			taxpayersIdentificationNumber,
			vatRegistrationNumber,
			averageAnnualContractValue,
			highestSingularContractValue,
			address: !!address ? MapAddress.inAllControllers(address) : null,
			category: !!category ? MapCategory.inAllControllers(category) : null,
			products: !!products ? products.map(x => MapProduct.inAllControllers(x)) : new Array<Product>(),
			user: new User({
				id: user.id,
				urlToken: user.urlToken,
				cpdPoints: user.cpdPoints,
				type: user.type
			} as User)
		} as Company;
	}

	export function inUsersControllerCreateAsync(company: Company): Company {
		return {
			id: company.id,
			urlToken: company.urlToken,
			logoUrl: company.logoUrl,
			name: company.name,
			verified: company.verified,
			category: MapCategory.inAllControllers(company.category)
		} as Company;
	}

	export function inUsersControllerUpdateAsync(company: Company): Company {
		return {
			id: company.id,
			urlToken: company.urlToken,
			logoUrl: company.logoUrl,
			name: company.name,
			verified: company.verified,
			category: MapCategory.inAllControllers(company.category)
		} as Company;
	}

	export function inUsersControllerVerifyAsync(company: Company): Company {
		return {
			id: company.id,
			urlToken: company.urlToken,
			logoUrl: company.logoUrl,
			name: company.name,
			verified: company.verified,
			category: MapCategory.inAllControllers(company.category)
		} as Company;
	}

	export function inMapCommentInAllControllers(company: Company): Company {
		return {
			id: company.id,
			urlToken: company.urlToken,
			logoUrl: company.logoUrl,
			name: company.name,
			verified: company.verified
		} as Company;
	}
}
