import { User } from "../entities/User";
import { Company } from "../entities/Company";
import { Experience } from "../entities/Experience";
import { MapExperience } from "./mapExperience";
import { MapSkill } from "./mapSkill";
import { Skill } from "../entities/Skill";
import { MapCertificate } from "./mapCertificate";
import { Certificate } from "crypto";
import { MapAddress } from "./mapAddress";
import { View } from "../entities/View";

export namespace MapUser {
	export function inSearchControllerSearchAsync(user: User): User {
		return {
			id: user.id,
			type: user.type,
			firstName: user.firstName,
			lastName: user.lastName,
			urlToken: user.urlToken,
			verified: user.verified,
			profilePhoto: !!user.profilePhoto
				? {
						id: user.profilePhoto.id,
						url: user.profilePhoto.url
				  }
				: null,
			latestExperience:
				!!user.latestExperience && user.latestExperience.current
					? {
							role: user.latestExperience.role,
							organization: user.latestExperience.organization
					  }
					: null
		} as User;
	}

	export function inAllControllers(user: User): User {
		return {
			id: user.id,
			type: user.type,
			firstName: user.firstName,
			lastName: user.lastName,
			urlToken: user.urlToken,
			verified: user.verified,
			profilePhoto: !!user.profilePhoto
				? {
						id: user.profilePhoto.id,
						url: user.profilePhoto.url
				  }
				: null,
			company: !!user.company
				? new Company({
						id: user.company.id,
						address: !!user.company.address ? MapAddress.inAllControllers(user.company.address) : null,
						name: user.company.name,
						logoUrl: user.company.logoUrl,
						urlToken: user.company.urlToken,
						phone: user.company.phone,
						website: user.company.website,
						email: user.company.email
				  } as Company)
				: null,
			latestExperience:
				!!user.latestExperience && user.latestExperience.current
					? {
							id: user.latestExperience.id,
							role: user.latestExperience.role,
							organization: user.latestExperience.organization
					  }
					: null,
			address: !!user.address ? MapAddress.inAllControllers(user.address) : null
		} as User;
	}

	export function inUsersControllerGetProfileLiteAsync(user: User): User {
		const {
			id,
			type,
			firstName,
			lastName,
			urlToken,
			verified,
			profilePhoto,
			twitterUrl,
			facebookUrl,
			linkedInUrl,
			googlePlusUrl,
			company,
			latestExperience,
			address,
			views
		} = user;
		return {
			id,
			type,
			firstName,
			lastName,
			verified,
			urlToken,
			twitterUrl,
			facebookUrl,
			linkedInUrl,
			googlePlusUrl,
			address: !!user.address ? MapAddress.inAllControllers(user.address) : null,
			profilePhoto: !!profilePhoto
				? {
						id: profilePhoto.id,
						url: profilePhoto.url
				  }
				: null,
			company: !!company
				? new Company({
						id: company.id,
						address: !!company.address ? MapAddress.inAllControllers(company.address) : null,
						name: company.name,
						logoUrl: company.logoUrl,
						urlToken: company.urlToken,
						phone: company.phone,
						website: company.website,
						email: company.email
				  } as Company)
				: null,
			latestExperience:
				!!user.latestExperience && user.latestExperience.current
					? {
							id: user.latestExperience.id,
							role: user.latestExperience.role,
							organization: user.latestExperience.organization
					  }
					: null,
			views: !!views ? views.map(x => new View({ id: x.id })) : new Array<View>()
		} as User;
	}

	export function inUsersControllerGetProfileAsync(user: User): User {
		const {
			id,
			urlToken,
			address,
			verified,
			profilePhoto,
			type,
			firstName,
			lastName,
			twitterUrl,
			facebookUrl,
			linkedInUrl,
			googlePlusUrl,
			email,
			phone,
			cpdPoints,
			description,
			experiences,
			certifications,
			skills
		} = user;
		return {
			id,
			urlToken,
			verified,
			type,
			firstName,
			lastName,
			twitterUrl,
			facebookUrl,
			linkedInUrl,
			googlePlusUrl,
			email,
			phone,
			cpdPoints,
			description,
			profilePhoto: !!profilePhoto
				? {
						id: profilePhoto.id,
						url: profilePhoto.url
				  }
				: null,
			latestExperience:
				!!user.latestExperience && user.latestExperience.current
					? {
							role: user.latestExperience.role,
							organization: user.latestExperience.organization
					  }
					: null,
			address: MapAddress.inAllControllers(address),
			experiences: !!experiences ? experiences.map(x => MapExperience.inAllControllers(x)) : new Array<Experience>(),
			skills: !!skills ? skills.map(x => MapSkill.inAllControllers(x)) : new Array<Skill>(),
			certifications: !!certifications ? certifications.map(x => MapCertificate.inAllControllers(x)) : new Array<Certificate>()
		} as User;
	}

	export function inUsersControllerGetByUrlTokenAsync(user: User): User {
		const {
			id,
			urlToken,
			address,
			verified,
			type,
			firstName,
			lastName,
			twitterUrl,
			facebookUrl,
			linkedInUrl,
			googlePlusUrl,
			email,
			phone,
			cpdPoints,
			description,
			profilePhoto,
			experiences,
			certifications,
			skills
		} = user;
		return {
			id,
			urlToken,
			verified,
			type,
			firstName,
			lastName,
			twitterUrl,
			facebookUrl,
			linkedInUrl,
			googlePlusUrl,
			email,
			phone,
			cpdPoints,
			description,
			profilePhoto: !!profilePhoto
				? {
						id: profilePhoto.id,
						url: profilePhoto.url
				  }
				: null,
			latestExperience:
				!!user.latestExperience && user.latestExperience.current
					? {
							role: user.latestExperience.role,
							organization: user.latestExperience.organization
					  }
					: null,
			address: MapAddress.inAllControllers(address),
			experiences: !!experiences ? experiences.map(x => MapExperience.inAllControllers(x)) : new Array<Experience>(),
			skills: !!skills ? skills.map(x => MapSkill.inAllControllers(x)) : new Array<Skill>(),
			certifications: !!certifications ? certifications.map(x => MapCertificate.inAllControllers(x)) : new Array<Certificate>()
		} as User;
	}
}
