import { UsersController } from "../controller/UsersController";
import { AccountController } from "../controller/AccountController";

export interface IRoute {
    method: string;
    route: string;
    controller: any;
    action: string;
    protected?: boolean;
    admin?: boolean;
}

export const Routes = [{
    method: "post",
    route: "/account/login",
    controller: AccountController,
    action: "login"
}, {
    method: "post",
    route: "/account/register",
    controller: AccountController,
    action: "register"
}, {
    method: "get",
    route: "/users/search",
    controller: UsersController,
    action: "search",
    protected: true,
    admin: true
}];