import { Job } from "../entities/Job";
import { MapAddress } from "./mapAddress";

export namespace MapJob {

    export function inJobsControllerGetLatestAsync(job: Job): Job {
        const { id, organizationName, organizationLogoUrl, title, urlToken } = job;
        return {
            id, organizationName, organizationLogoUrl, title, urlToken
        } as Job;
    }

    export function inJobsControllerGetAllAsync(job: Job): Job {
        const { id, organizationName, organizationLogoUrl, title, urlToken, applicationUrl } = job;
        return {
            id, organizationName, organizationLogoUrl, title, urlToken, applicationUrl
        } as Job;
    }

    export function inJobsControllerGetByUrlTokenAsync(job: Job): Job {
        const { id, type, address, organizationName, organizationLogoUrl, title, urlToken, applicationUrl, roles, description, requirements } = job;
        return {
            id, type, organizationName, organizationLogoUrl, title, urlToken, applicationUrl, roles, description, requirements,
            address: MapAddress.inAllControllers(address),
        } as Job;
    }

    export function inJobsControllerCreateAsync(job: Job): Job {
        const { id, organizationName, organizationLogoUrl, title, urlToken, applicationUrl } = job;
        return {
            id, organizationName, organizationLogoUrl, title, urlToken, applicationUrl
        } as Job;
    }

    export function inJobsControllerUpdateAsync(job: Job): Job {
        const { id, organizationName, organizationLogoUrl, title, urlToken, applicationUrl } = job;
        return {
            id, organizationName, organizationLogoUrl, title, urlToken, applicationUrl
        } as Job;
    }

    export function inJobsControllerPublishAsync(job: Job): Job {
        const { id, organizationName, organizationLogoUrl, title, urlToken, applicationUrl } = job;
        return {
            id, organizationName, organizationLogoUrl, title, urlToken, applicationUrl
        } as Job;
    }

    export function inJobsControllerUnPublishAsync(job: Job): Job {
        const { id, organizationName, organizationLogoUrl, title, urlToken, applicationUrl } = job;
        return {
            id, organizationName, organizationLogoUrl, title, urlToken, applicationUrl
        } as Job;
    }
}