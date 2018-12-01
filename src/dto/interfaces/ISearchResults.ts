import { User } from "../../entities/User";

export interface ISearchResults {
	members: Array<User>;
	vendors: Array<User>;
}
