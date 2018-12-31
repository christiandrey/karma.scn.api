import { Resource } from "../entities/Resource";
import { MapUser } from "./mapUser";
import { User } from "../entities/User";
import { Company } from "../entities/Company";

export namespace MapResource {
	export function inResourcesControllerGetAllAsync(resource: Resource): Resource {
		const { id, createdDate, title, description, isPublished, publicationDate, user, purchaseUrl } = resource;
		return {
			id,
			createdDate,
			title,
			description,
			isPublished,
			publicationDate,
			purchaseUrl,
			user: new User({
				id: user.id,
				type: user.type,
				firstName: user.firstName,
				lastName: user.lastName,
				company: !!user.company
					? new Company({
							id: user.company.id,
							urlToken: user.company.urlToken,
							name: user.company.name
					  })
					: null
			})
		} as Resource;
	}

	export function inResourcesControllerCreateAsync(resource: Resource): Resource {
		const { id, title, description, isPublished, publicationDate, user, purchaseUrl } = resource;
		return {
			id,
			title,
			description,
			isPublished,
			publicationDate,
			purchaseUrl,
			user: new User({
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName
			})
		} as Resource;
	}

	export function inResourcesControllerUpdateAsync(resource: Resource): Resource {
		const { id, title, description, isPublished, publicationDate, user, purchaseUrl } = resource;
		return {
			id,
			title,
			description,
			isPublished,
			publicationDate,
			purchaseUrl,
			user: new User({
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName
			})
		} as Resource;
	}

	export function inResourcesControllerPublishAsync(resource: Resource): Resource {
		const { id, title, description, isPublished, publicationDate, user, purchaseUrl } = resource;
		return {
			id,
			title,
			description,
			isPublished,
			publicationDate,
			purchaseUrl,
			user: new User({
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName
			})
		} as Resource;
	}

	export function inResourcesControllerUnPublishAsync(resource: Resource): Resource {
		const { id, title, description, isPublished, publicationDate, user, purchaseUrl } = resource;
		return {
			id,
			title,
			description,
			isPublished,
			publicationDate,
			purchaseUrl,
			user: new User({
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName
			})
		} as Resource;
	}
}
