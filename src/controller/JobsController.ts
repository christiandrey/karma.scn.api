import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { Job } from "../entities/Job";
import { Methods } from "../shared/methods";
import { MapJob } from "../mapping/mapJob";
import { validate } from "class-validator";
import { FormResponse } from "../dto/classes/FormResponse";
import { IFormResponse } from "../dto/interfaces/IFormResponse";
import { Address } from "../entities/Address";
import { Country } from "../entities/Country";
import { User } from "../entities/User";
import { UserService } from "../services/userService";
import { UserTypeEnum } from "../enums/UserTypeEnum";

export class JobsController {

    private jobRepository = getRepository(Job);

    async getLatestAsync(req: Request, resp: Response, next: NextFunction) {
        const jobs = await this.jobRepository.find({
            where: {
                isPublished: true
            },
            order: {
                createdDate: "DESC"
            },
            skip: 0,
            take: 4
        });

        const response = jobs.map(j => MapJob.inJobsControllerGetLatestAsync(j));

        return Methods.getJsonResponse(response);
    }

    async getAllAsync(req: Request, resp: Response, next: NextFunction) {
        const jobs = await this.jobRepository.find({
            where: {
                isPublished: true
            },
            order: {
                createdDate: "DESC"
            }
        });

        const response = jobs.map(a => MapJob.inJobsControllerGetAllAsync(a));

        return Methods.getJsonResponse(response, `${jobs.length} jobs found`);
    }

    async getByUrlTokenAsync(req: Request, resp: Response, next: NextFunction) {
        const urlToken = req.params.urlToken as string;
        const job = await this.jobRepository.findOne({ urlToken });

        if (!!job || !job.isPublished) {
            Methods.sendErrorResponse(resp, 404, "Job was not found");
        }

        if (UserService.getAuthenticatedUserType(req) !== UserTypeEnum.Admin) {
            job.viewCount++;
            await this.jobRepository.save(job);
        }

        const response = MapJob.inJobsControllerGetByUrlTokenAsync(job);

        return Methods.getJsonResponse(response);
    }

    async createAsync(req: Request, resp: Response, next: NextFunction) {
        const job = new Job(req.body);

        // ------------------------------------------------------------------------
        // Validate the data
        // ------------------------------------------------------------------------

        const validationResult = await validate(job);
        if (validationResult.length > 0) {
            const invalidResponse = new FormResponse({
                isValid: false,
                errors: validationResult.map(e => e.toString())
            } as IFormResponse);
            return Methods.getJsonResponse(invalidResponse, "Job data provided was not valid", false);
        }

        // ------------------------------------------------------------------------
        // Create New Entity
        // ------------------------------------------------------------------------

        const { title, type, address, organizationName, organizationLogoUrl, applicationUrl, description, roles, requirements } = job;

        const jobToCreate = new Job({
            title, type, organizationName, organizationLogoUrl, applicationUrl, description, roles, requirements,
            address: new Address({
                city: job.address.city,
                state: job.address.state,
                country: new Country({
                    id: job.address.country.id
                })
            }),
            isPublished: false,
            author: new User({ id: UserService.getAuthenticatedUserId(req) })
        });

        const createdJob = await this.jobRepository.save(jobToCreate);
        const validResponse = new FormResponse<Job>({
            isValid: true,
            target: MapJob.inJobsControllerCreateAsync(createdJob)
        });
        return Methods.getJsonResponse(validResponse);
    }

    async updateAsync(req: Request, resp: Response, next: NextFunction) {
        const job = new Job(req.body);
        const authenticatedUser = await UserService.getAuthenticatedUserAsync(req);
        const validationResult = await validate(job);

        if (validationResult.length > 0) {
            const invalidResponse = new FormResponse({
                isValid: false,
                errors: validationResult.map(e => e.toString())
            } as IFormResponse);
            return Methods.getJsonResponse(invalidResponse, "Job data provided was not valid", false);
        }

        const dbJob = await this.jobRepository.findOne({ id: job.id });

        if (!dbJob) {
            Methods.sendErrorResponse(resp, 404, "Job was not found");
            return;
        }

        if (dbJob.isPublished) {
            if (authenticatedUser.type !== UserTypeEnum.Admin) {
                Methods.sendErrorResponse(resp, 401, "Only Administrators can edit jobs after they have been published");
                return;
            }
        }

        const { title, organizationName, organizationLogoUrl, applicationUrl, type, description, requirements, roles, address } = job;

        dbJob.title = title;
        dbJob.organizationName = organizationName;
        dbJob.organizationLogoUrl = organizationLogoUrl;
        dbJob.applicationUrl = applicationUrl;
        dbJob.type = type;
        dbJob.description = description;
        dbJob.requirements = requirements;
        dbJob.roles = roles;
        dbJob.address.city = address.city;
        dbJob.address.state = address.state;
        dbJob.address.country.id = address.country.id;

        const updatedJob = await this.jobRepository.save(dbJob);
        const validResponse = new FormResponse<Job>({
            isValid: true,
            target: MapJob.inJobsControllerUpdateAsync(updatedJob)
        });
        return Methods.getJsonResponse(validResponse);
    }

    async publishAsync(req: Request, resp: Response, next: NextFunction) {
        const id = req.params.id as string;
        const job = await this.jobRepository.findOne(id);

        if (!!job) {
            Methods.sendErrorResponse(resp, 404, "Job was not found");
            return;
        }

        if (job.isPublished) {
            Methods.sendErrorResponse(resp, 400, "Job has already been published");
            return;
        }

        job.isPublished = true;
        job.publicationDate = new Date();

        const publishedJob = await this.jobRepository.save(job);
        const response = MapJob.inJobsControllerPublishAsync(publishedJob);

        return Methods.getJsonResponse(response, "Job was successfully published");
    }

    async unPublishAsync(req: Request, resp: Response, next: NextFunction) {
        const id = req.params.id as string;
        const job = await this.jobRepository.findOne(id);

        if (!!job) {
            Methods.sendErrorResponse(resp, 404, "Job was not found");
            return;
        }

        if (!job.isPublished) {
            Methods.sendErrorResponse(resp, 400, "Job is not yet published");
            return;
        }

        job.isPublished = false;

        const unpublishedJob = await this.jobRepository.save(job);
        const response = MapJob.inJobsControllerUnPublishAsync(unpublishedJob);

        return Methods.getJsonResponse(response, "Job was successfully unpublished");
    }
}