import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Methods } from "../shared/methods";
import { validate } from "class-validator";
import { FormResponse } from "../dto/classes/FormResponse";
import { IFormResponse } from "../dto/interfaces/IFormResponse";
import { Skill } from "../entities/Skill";
import { MapSkill } from "../mapping/mapSkill";

export class SkillsController {

    private skillRepository = getRepository(Skill);

    async getAllAsync(req: Request, resp: Response, next: NextFunction) {
        const skills = await this.skillRepository.find({
            order: {
                title: "ASC"
            }
        });

        const response = skills.map(x => MapSkill.inAllControllers(x));

        return Methods.getJsonResponse(response, `${skills.length} skills found`);
    }

    async createAsync(req: Request, resp: Response, next: NextFunction) {
        const skill = new Skill(req.body);

        // ------------------------------------------------------------------------
        // Validate the data
        // ------------------------------------------------------------------------

        const validationResult = await validate(skill);
        if (validationResult.length > 0) {
            const invalidResponse = new FormResponse({
                isValid: false,
                errors: validationResult.map(e => e.constraints[Object.keys(e.constraints)[0]])
            } as IFormResponse);
            return Methods.getJsonResponse(invalidResponse, "Skill data provided was not valid", false);
        }

        // ------------------------------------------------------------------------
        // Check for existing entity
        // ------------------------------------------------------------------------

        const name = Methods.toCamelCase(skill.title.replace(/[^a-zA-Z0-9\s\s+]/g, ""));
        const dbSkill = await this.skillRepository.findOne({ name });

        if (!!dbSkill) {
            const invalidResponse = new FormResponse({
                isValid: false,
                errors: ["A skill with the same title already exists"]
            } as IFormResponse);
            return Methods.getJsonResponse(invalidResponse, "A skill with the same title already exists", false);
        }

        // ------------------------------------------------------------------------
        // Create New Entity
        // ------------------------------------------------------------------------

        const { title } = skill;

        const skillToCreate = new Skill({
            title
        });

        const createdSkill = await this.skillRepository.save(skillToCreate);
        const validResponse = new FormResponse<Skill>({
            isValid: true,
            target: MapSkill.inAllControllers(createdSkill)
        });
        return Methods.getJsonResponse(validResponse);
    }
}