import { Media } from "../entities/Media";
import { User } from "../entities/User";
import { Company } from "../entities/Company";

export namespace MapMedia {
	export function inMediaControllerUploadAsync(media: Media): Media {
		return {
			id: media.id,
			url: media.url,
			note: media.note,
			user: !!media.user
				? new User({
						id: media.user.id
				  })
				: null,
			company: !!media.company
				? new Company({
						id: media.company.id
				  })
				: null
		} as Media;
	}

	export function inMediaControllerDeleteAsync(media: Media): Media {
		return {
			id: media.id,
			url: media.url
		} as Media;
	}

	export function inAllControllers(media: Media): Media {
		return {
			id: media.id,
			url: media.url,
			note: media.note,
			name: media.name,
			type: media.type
		} as Media;
	}
}
