import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { User } from "../entities/User";

export class UsersController {

    private userRepository = getRepository(User);

    async search(req: Request, resp: Response, next: NextFunction) {
        return this.userRepository.find();
    }
}