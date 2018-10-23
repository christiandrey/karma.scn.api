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

// export const Routes = [{
//     method: "get",
//     route: "/users",
//     controller: UsersController,
//     action: "all"
// }, {
//     method: "get",
//     route: "/users/:id",
//     controller: UsersController,
//     action: "one"
// }, {
//     method: "post",
//     route: "/users",
//     controller: UsersController,
//     action: "save"
// }, {
//     method: "delete",
//     route: "/users",
//     controller: UsersController,
//     action: "remove"
// }];

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