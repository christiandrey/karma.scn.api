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

export class SearchController {

    private userRepository = getRepository(User);
    private companyRepository = getRepository(Company);

    async searchAsync(req: Request, resp: Response, next: NextFunction) {
        const { params } = req;
        const type = +params.type as UserTypeEnum;
        const category = params.category as string;
        const location = params.location as string;
        let users = new Array<User>();
        let companies = new Array<Company>();

        if (type === UserTypeEnum.Member) {
            let dbUsers = await this.userRepository.find({ type: UserTypeEnum.Member });

            if (dbUsers.length > 0 && location !== Constants.locationEverywhere) {
                const state = location.split(", ")[0];
                const countryName = location.split(", ")[1];
                dbUsers = dbUsers.filter(u => !!u.address && Methods.includesSubstring(u.address.state, state, true) && Methods.includesSubstring(u.address.country.name, countryName, true));
            }

            users = dbUsers.map(u => MapUser.inSearchControllerSearchAsync(u));
        }

        if (type === UserTypeEnum.Vendor) {
            let dbCompanies = await this.companyRepository.find();

            if (dbCompanies.length > 0 && category !== Constants.categoryAll) {
                dbCompanies = dbCompanies.filter(c => c.urlToken === category);
            }

            companies = dbCompanies.map(c => MapCompany.inSearchControllerSearchAsync(c));
        }

        var response = {
            users,
            companies
        } as ISearchResults;

        return Methods.getJsonResponse(response, `${users.length} member(s) and ${companies.length} vendor(s) found`);
    }
}