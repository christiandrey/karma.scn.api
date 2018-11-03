import { Skill } from "../entities/Skill";

export namespace MapSkill {
    export function inAllControllers(skill: Skill): Skill {
        const { id, name, title } = skill;
        return {
            id, name, title
        } as Skill;
    }
}