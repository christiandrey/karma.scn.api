import { UsersController } from "../controller/UsersController";
import { AccountController } from "../controller/AccountController";
import { CategoriesController } from "../controller/CategoriesController";
import { SearchController } from "../controller/SearchController";

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
    route: "/categories",
    controller: CategoriesController,
    action: "createAsync",
    protected: true,
    admin: true
}, {
    method: "put",
    route: "/categories",
    controller: CategoriesController,
    action: "updateAsync",
    protected: true,
    admin: true
}, {
    method: "delete",
    route: "/categories/:id",
    controller: CategoriesController,
    action: "deleteAsync",
    protected: true,
    admin: true
}, {
    method: "get",
    route: "/search/:type/:category/:location",
    controller: SearchController,
    action: "searchAsync",
    protected: true
}];