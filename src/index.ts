import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { Routes } from "./shared/routes";
// import { Routes, IRoute } from "./routes";
// import * as passport from "passport";
import { User } from "./entity/User";

createConnection().then(async connection => {

    // require("./auth/passport");

    // create express app
    const app = express();
    app.use(bodyParser.json());

    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next);
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

            } else if (result !== null && result !== undefined) {
                res.json(result);
            }
        });
    });

    // Routes.forEach((route: IRoute) => {
    //     const authMiddleware = route.protected ? passport.authenticate("jwt", { session: false }) : null;
    //     if (route.protected) {
    //         (app as any)[route.method](route.route, passport.authenticate("jwt", { session: false }), (req: Request, res: Response, next: Function) => {
    //             const result = (new (route.controller as any))[route.action](req, res, next);
    //             if (result instanceof Promise) {
    //                 result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);
    //             } else if (result !== null && result !== undefined) {
    //                 res.json(result);
    //             }
    //         });
    //     } else {
    //         (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
    //             const result = (new (route.controller as any))[route.action](req, res, next);
    //             if (result instanceof Promise) {
    //                 result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);
    //             } else if (result !== null && result !== undefined) {
    //                 res.json(result);
    //             }
    //         });
    //     }
    // });

    app.listen(1811);

    console.log("Express server has started on port 1811. Open http://localhost:1811/users to see results");

}).catch(error => console.log(error));
