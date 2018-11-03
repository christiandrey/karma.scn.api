import { Like } from "../entities/Like";
import { MapUser } from "./mapUser";

export namespace MapLike {

    export function inAllControllers(like: Like): Like {
        const { id, user } = like;
        return {
            id,
            user: MapUser.inAllControllers(user),
        } as Like;
    }
}