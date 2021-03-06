import { UserTypeEnum } from "../../enums/UserTypeEnum";

export interface ISearchRequest {
	type?: UserTypeEnum;
	category?: string;
	location?: string;
	product?: string;
	query?: string;
}
