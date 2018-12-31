import { Webinar } from "../entities/Webinar";
import { MapUser } from "./mapUser";
import { MapMedia } from "./mapMedia";
import { MapComment } from "./mapComment";
import { Comment } from "../entities/Comment";
import { User } from "../entities/User";
import { Company } from "../entities/Company";

export namespace MapWebinar {
	export function inWebinarControllersGetAllAsync(webinar: Webinar): Webinar {
		const { id, anchor, cpdPoints, status, topic, description, urlToken, startDateTime, participants } = webinar;
		return {
			id,
			cpdPoints,
			status,
			topic,
			description,
			urlToken,
			startDateTime,
			anchor: MapUser.inAllControllers(anchor),
			participants: !!participants
				? participants.map(
						x =>
							new User({
								id: x.id,
								firstName: x.firstName,
								lastName: x.lastName,
								type: x.type,
								company: !!x.company
									? new Company({
											id: x.company.id,
											name: x.company.name
									  })
									: null
							})
				  )
				: new Array<User>()
		} as Webinar;
	}

	export function inWebinarControllersCreateAsync(webinar: Webinar): Webinar {
		const { id, cpdPoints, status, topic, description, urlToken, startDateTime, anchor } = webinar;
		return {
			id,
			cpdPoints,
			status,
			topic,
			description,
			urlToken,
			startDateTime,
			anchor: MapUser.inAllControllers(anchor),
			participants: new Array<User>()
		} as Webinar;
	}

	export function inWebinarControllersUpdateAsync(webinar: Webinar): Webinar {
		const { id, cpdPoints, status, topic, description, urlToken, startDateTime } = webinar;
		return {
			id,
			cpdPoints,
			status,
			topic,
			description,
			urlToken,
			startDateTime
		} as Webinar;
	}

	export function inWebinarControllersGetByUrlTokenAsync(webinar: Webinar): Webinar {
		const { id, createdDate, anchor, cpdPoints, topic, description, urlToken, transcript, startDateTime, status, comments, participants } = webinar;
		return {
			id,
			createdDate,
			cpdPoints,
			topic,
			description,
			urlToken,
			startDateTime,
			status,
			anchor: MapUser.inAllControllers(anchor),
			transcript: !!transcript ? MapMedia.inAllControllers(transcript) : null,
			comments: !!comments ? comments.map(c => MapComment.inAllControllers(c)) : new Array<Comment>(),
			participants: !!participants ? participants.map(x => new User({ id: x.id })) : new Array<User>()
		} as Webinar;
	}

	export function inWebinarControllersJoinStartFinishAsync(webinar: Webinar): Webinar {
		const { id, cpdPoints, status, topic, description, urlToken, startDateTime, participants } = webinar;
		return {
			id,
			cpdPoints,
			status,
			topic,
			description,
			urlToken,
			startDateTime,
			participants: !!participants ? participants.map(x => new User({ id: x.id })) : new Array<User>()
		} as Webinar;
	}
}
