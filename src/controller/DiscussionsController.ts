import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { Discussion } from "../entities/Discussion";
import { MapDiscussion } from "../mapping/mapDiscussion";
import { Methods } from "../shared/methods";
import { validate } from "class-validator";
import { FormResponse } from "../dto/classes/FormResponse";
import { IFormResponse } from "../dto/interfaces/IFormResponse";
import { User } from "../entities/User";
import { UserService } from "../services/userService";
import { Comment } from "../entities/Comment";
import { MapComment } from "../mapping/mapComment";
import { CommentService } from "../services/commentService";

export class DiscussionsController {

    private discussionRepository = getRepository(Discussion);

    async getLatestAsync(req: Request, resp: Response, next: NextFunction) {
        const discussions = await this.discussionRepository.find({
            order: {
                createdDate: "DESC"
            },
            skip: 0,
            take: 3
        });

        const response = discussions.map(d => MapDiscussion.inDiscussionsControllerGetLatestAsync(d));

        return Methods.getJsonResponse(response);
    }

    async getAllAsync(req: Request, resp: Response, next: NextFunction) {
        const discussions = await this.discussionRepository.find({
            order: {
                createdDate: "DESC"
            }
        });

        const response = discussions.map(d => MapDiscussion.inDiscussionsControllerGetAllAsync(d));

        return Methods.getJsonResponse(response, `${discussions.length} discussions found`);
    }

    async getByUrlToken(req: Request, resp: Response, next: NextFunction) {
        const urlToken = req.params.urlToken as string;
        const discussion = await this.discussionRepository.findOne({ urlToken });

        if (!!discussion) {
            Methods.sendErrorResponse(resp, 404, "Discussion was not found");
        }

        const response = MapDiscussion.inDiscussionsControllerGetByUrlToken(discussion);

        return Methods.getJsonResponse(response);
    }

    async createAsync(req: Request, resp: Response, next: NextFunction) {
        const discussion = new Discussion(req.body);

        // ------------------------------------------------------------------------
        // Validate the data
        // ------------------------------------------------------------------------

        const validationResult = await validate(discussion);
        if (validationResult.length > 0) {
            const invalidResponse = new FormResponse({
                isValid: false,
                errors: validationResult.map(e => e.toString())
            } as IFormResponse);
            return Methods.getJsonResponse(invalidResponse, "Discussion data provided was not valid", false);
        }

        // ------------------------------------------------------------------------
        // Create New Entity
        // ------------------------------------------------------------------------

        const { topic, description } = discussion;

        const discussionToCreate = new Discussion({
            topic, description,
            author: new User({ id: UserService.getAuthenticatedUserId(req) })
        });

        const createdDiscussion = await this.discussionRepository.save(discussionToCreate);
        const validResponse = new FormResponse<Discussion>({
            isValid: true,
            target: MapDiscussion.inDiscussionsControllerCreateAsync(createdDiscussion)
        });

        return Methods.getJsonResponse(validResponse);
    }

    async addCommentAsync(req: Request, resp: Response, next: NextFunction) {
        const discussion = await this.discussionRepository.findOne({ id: req.params.id });

        if (!discussion) {
            Methods.sendErrorResponse(resp, 404, "Discussion was not found");
            return;
        }

        const comment = new Comment(req.body);
        comment.discussion = new Discussion({ id: discussion.id });

        return await CommentService.addCommentAsync(req, comment);
    }
}