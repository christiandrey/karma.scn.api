import { NextFunction, Request, Response } from "express";
import { User } from "../entities/User";
import { getRepository } from "typeorm";
import { Constants } from "../shared/constants";
import { Methods } from "../shared/methods";
import { Experience } from "../entities/Experience";
import { validate } from "class-validator";
import { FormResponse } from "../dto/classes/FormResponse";
import { IFormResponse } from "../dto/interfaces/IFormResponse";
import { UserService } from "../services/userService";
import { MapExperience } from "../mapping/mapExperience";
import { CacheService } from "../services/cacheService";

export class ExperiencesController {

    private experienceRepository = getRepository(Experience);

    async createAsync(req: Request, resp: Response, next: NextFunction) {
        const experience = new Experience(req.body);

        // ------------------------------------------------------------------------
        // Validate the data
        // ------------------------------------------------------------------------

        const validationResult = await validate(experience);
        if (validationResult.length > 0) {
            const invalidResponse = new FormResponse({
                isValid: false,
                errors: validationResult.map(e => e.constraints[Object.keys(e.constraints)[0]])
            } as IFormResponse);
            return Methods.getJsonResponse(invalidResponse, "Experience data provided was not valid", false);
        }

        // ------------------------------------------------------------------------
        // Create New Entity
        // ------------------------------------------------------------------------

        const { role, description, organization, startDate, endDate, current, companyLogoUrl } = experience;

        const experienceToCreate = new Experience({
            role, description, organization, startDate, endDate, current, companyLogoUrl,
            user: new User({ id: UserService.getAuthenticatedUserId(req) })
        });

        const createdExperience = await this.experienceRepository.save(experienceToCreate);
        const validResponse = new FormResponse<Experience>({
            isValid: true,
            target: MapExperience.inAllControllers(createdExperience)
        });
        CacheService.invalidateCacheItem(Constants.sortedTimelinePosts);
        return Methods.getJsonResponse(validResponse);
    }
}