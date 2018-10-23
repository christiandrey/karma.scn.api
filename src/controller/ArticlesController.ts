import { NextFunction, Request, Response } from "express";
import { User } from "../entities/User";
import { getRepository } from "typeorm";
import { Constants } from "../shared/constants";
import { Methods } from "../shared/methods";
import { Company } from "../entities/Company";
import { UserTypeEnum } from "../enums/UserTypeEnum";
import { MapUser } from "../mapping/mapUser";
import { MapCompany } from "../mapping/mapCompany";
import { ISearchResults } from "../dto/interfaces/ISearchResults";
import { Article } from "../entities/Article";

export class ArticlesController {

    private articleRepository = getRepository(Article);

    async getLatestAsync(req: Request, resp: Response, next: NextFunction) {

    }
}