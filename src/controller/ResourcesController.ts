import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { Methods } from "../shared/methods";
import { validate } from "class-validator";
import { FormResponse } from "../dto/classes/FormResponse";
import { IFormResponse } from "../dto/interfaces/IFormResponse";
import { User } from "../entities/User";
import { UserService } from "../services/userService";
import { UserTypeEnum } from "../enums/UserTypeEnum";
import { Resource } from "../entities/Resource";
import { MapResource } from "../mapping/mapResource";
import { CacheService } from "../services/cacheService";
import { Constants } from "../shared/constants";

export class ResourcesController {

    private resourceRepository = getRepository(Resource);

    async getAllAsync(req: Request, resp: Response, next: NextFunction) {
        const resources = await this.resourceRepository.find({
            where: {
                isPublished: true
            },
            order: {
                createdDate: "DESC"
            }
        });

        const response = resources.map(r => MapResource.inResourcesControllerGetAllAsync(r));

        return Methods.getJsonResponse(response, `${resources.length} resources found`);
    }

    async createAsync(req: Request, resp: Response, next: NextFunction) {
        const resource = new Resource(req.body);

        // ------------------------------------------------------------------------
        // Validate the data
        // ------------------------------------------------------------------------

        const validationResult = await validate(resource);
        if (validationResult.length > 0) {
            const invalidResponse = new FormResponse({
                isValid: false,
                errors: validationResult.map(e => e.constraints)
            } as IFormResponse);
            return Methods.getJsonResponse(invalidResponse, "Resource data provided was not valid", false);
        }

        // ------------------------------------------------------------------------
        // Create New Entity
        // ------------------------------------------------------------------------

        const { title, description, purchaseUrl } = resource;

        const resourceToCreate = new Resource({
            title, description, purchaseUrl,
            isPublished: false,
            user: new User({ id: UserService.getAuthenticatedUserId(req) })
        });

        const createdResource = await this.resourceRepository.save(resourceToCreate);
        const validResponse = new FormResponse<Resource>({
            isValid: true,
            target: MapResource.inResourcesControllerCreateAsync(createdResource)
        });
        CacheService.invalidateCacheItem(Constants.sortedTimelinePosts);
        return Methods.getJsonResponse(validResponse);
    }

    async updateAsync(req: Request, resp: Response, next: NextFunction) {
        const resource = new Resource(req.body);
        const authenticatedUser = await UserService.getAuthenticatedUserAsync(req);
        const validationResult = await validate(resource);

        if (validationResult.length > 0) {
            const invalidResponse = new FormResponse({
                isValid: false,
                errors: validationResult.map(e => e.constraints)
            } as IFormResponse);
            return Methods.getJsonResponse(invalidResponse, "Resource data provided was not valid", false);
        }

        const dbResource = await this.resourceRepository.findOne({ id: resource.id });

        if (!dbResource) {
            Methods.sendErrorResponse(resp, 404, "Resource was not found");
            return;
        }

        if (dbResource.isPublished) {
            if (authenticatedUser.type !== UserTypeEnum.Admin) {
                Methods.sendErrorResponse(resp, 401, "Only Administrators can edit resources after they have been published");
                return;
            }
        }

        const { title, description, purchaseUrl } = resource;

        dbResource.title = title;
        dbResource.description = description;
        dbResource.purchaseUrl = purchaseUrl;

        const updatedResource = await this.resourceRepository.save(dbResource);
        const validResponse = new FormResponse<Resource>({
            isValid: true,
            target: MapResource.inResourcesControllerUpdateAsync(updatedResource)
        });
        CacheService.invalidateCacheItem(Constants.sortedTimelinePosts);
        return Methods.getJsonResponse(validResponse);
    }

    async publishAsync(req: Request, resp: Response, next: NextFunction) {
        const id = req.params.id as string;
        const resource = await this.resourceRepository.findOne(id);

        if (!resource) {
            Methods.sendErrorResponse(resp, 404, "Resource was not found");
            return;
        }

        if (resource.isPublished) {
            Methods.sendErrorResponse(resp, 400, "Resource has already been published");
            return;
        }

        resource.isPublished = true;
        resource.publicationDate = new Date();

        const publishedResource = await this.resourceRepository.save(resource);
        const response = MapResource.inResourcesControllerPublishAsync(publishedResource);

        CacheService.invalidateCacheItem(Constants.sortedTimelinePosts);
        return Methods.getJsonResponse(response, "Resource was successfully published");
    }

    async unPublishAsync(req: Request, resp: Response, next: NextFunction) {
        const id = req.params.id as string;
        const resource = await this.resourceRepository.findOne(id);

        if (!resource) {
            Methods.sendErrorResponse(resp, 404, "Resource was not found");
            return;
        }

        if (!resource.isPublished) {
            Methods.sendErrorResponse(resp, 400, "Resource is not yet published");
            return;
        }

        resource.isPublished = false;

        const unpublishedResource = await this.resourceRepository.save(resource);
        const response = MapResource.inResourcesControllerUnPublishAsync(unpublishedResource);

        CacheService.invalidateCacheItem(Constants.sortedTimelinePosts);
        return Methods.getJsonResponse(response, "Resource was successfully unpublished");
    }
}