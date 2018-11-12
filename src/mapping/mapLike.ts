import { Like } from "../entities/Like";
import { MapUser } from "./mapUser";
import { User } from "../entities/User";

export namespace MapLike {
	export function inAllControllers(like: Like): Like {
		const { id, user } = like;
		return {
			id,
			user: MapUser.inAllControllers(user)
		} as Like;
	}

	export function inTimelineController(like: Like): Like {
		const { id, user } = like;
		return {
			id,
			user: new User({
				id: user.id
			})
		} as Like;
	}
}
