import { Discussion } from "../entities/Discussion";
import { MapUser } from "./mapUser";
import { MapComment } from "./mapComment";

export namespace MapDiscussion {

    export function inDiscussionsControllerGetLatestAsync(discussion: Discussion): Discussion {
        const { id, createdDate, topic, description, commentsCount, urlToken } = discussion;

        return {
            id, createdDate, topic, description, commentsCount, urlToken
        } as Discussion;
    }

    export function inDiscussionsControllerGetAllAsync(discussion: Discussion): Discussion {
        const { id, createdDate, topic, description, commentsCount, urlToken } = discussion;

        return {
            id, createdDate, topic, description, commentsCount, urlToken
        } as Discussion;
    }

    export function inDiscussionsControllerGetByUrlToken(discussion: Discussion): Discussion {
        const { id, createdDate, topic, description, commentsCount, comments, author, urlToken } = discussion;

        return {
            id, createdDate, topic, description, commentsCount, urlToken,
            author: MapUser.inAllControllers(author),
            comments: comments.map(c => MapComment.inAllControllers(c))
        } as Discussion;
    }

    export function inDiscussionsControllerCreateAsync(discussion: Discussion): Discussion {
        const { id, createdDate, topic, description, urlToken, commentsCount } = discussion;

        return {
            id, createdDate, topic, description, commentsCount, urlToken
        } as Discussion;
    }

    export function inDiscussionsControllerUpdateAsync(discussion: Discussion): Discussion {
        const { id, createdDate, topic, description, urlToken, commentsCount } = discussion;

        return {
            id, createdDate, topic, description, commentsCount, urlToken
        } as Discussion;
    }
}