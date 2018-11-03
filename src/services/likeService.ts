import { getRepository } from "typeorm";
import { Like } from "../entities/Like";
import { IJsonResponse } from "../interfaces/IJsonResponse";
import { validate } from "class-validator";
import { Methods } from "../shared/methods";
import { User } from "../entities/User";
import { UserService } from "./userService";
import { Request } from "express";
import { TimelineUpdate } from "../entities/TimelineUpdate";
import { TimelinePhoto } from "../entities/TimelinePhoto";
import { MapLike } from "../mapping/mapLike";

export namespace LikeService {

    export async function addLikeAsync(req: Request, like: Like): Promise<IJsonResponse<Like>> {
        const validationResult = await validate(like);

        if (validationResult.length > 0) {
            return {
                status: false,
                message: "Bad Request"
            } as IJsonResponse<any>;
        }

        const likeRepository = getRepository(Like);
        const { timelineUpdate, timelinePhoto } = like;

        const likeToCreate = new Like({
            timelineUpdate: !!timelineUpdate ? new TimelineUpdate({ id: timelineUpdate.id }) : null,
            timelinePhoto: !!timelinePhoto ? new TimelinePhoto({ id: timelinePhoto.id }) : null,
            user: new User({ id: UserService.getAuthenticatedUserId(req) })
        } as Like);

        const createdLike = await likeRepository.save(likeToCreate);
        const response = MapLike.inAllControllers(createdLike);

        return Methods.getJsonResponse(response);
    }

    export async function removeLikeAsync(id: string): Promise<IJsonResponse<Like>> {
        const likeRepository = getRepository(Like);
        const likeToRemove = await likeRepository.findOne(id);

        if (!!likeToRemove) {
            const deletedLike = await likeRepository.remove(likeToRemove);
            const response = MapLike.inAllControllers(deletedLike);
            return Methods.getJsonResponse(response, "Delete operation was successful");
        }

        return {
            status: false,
            message: "Like was not found"
        } as IJsonResponse<any>;
    }
}