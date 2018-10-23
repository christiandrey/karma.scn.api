import { User } from "../../entities/User";
import { Company } from "../../entities/Company";

export interface ISearchResults {
    users: Array<User>;
    companies: Array<Company>;
}