import { Experience } from "../entities/Experience";

export namespace MapExperience {
    export function inAllControllers(experience: Experience): Experience {
        const { id, role, description, organization, startDate, current, companyLogoUrl, endDate } = experience;
        return {
            id, role, description, organization, startDate, current, companyLogoUrl, endDate
        } as Experience;
    }
}