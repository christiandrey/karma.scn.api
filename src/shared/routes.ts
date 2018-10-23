import { UsersController } from "../controller/UsersController";
import { AccountController } from "../controller/AccountController";
import { CategoriesController } from "../controller/CategoriesController";

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
    method: "post",
    route: "/categories/create",
    controller: CategoriesController,
    action: "createAsync",
    protected: true,
    admin: true
}, {
    method: "put",
    route: "/categories/update",
    controller: CategoriesController,
    action: "updateAsync",
    protected: true,
    admin: true
}, {
    method: "delete",
    route: "/categories/delete/:id",
    controller: CategoriesController,
    action: "deleteAsync",
    protected: true,
    admin: true
}];