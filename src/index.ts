// import "./prototypes/prototypes";
import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as passport from "passport";
import * as fileUpload from "express-fileupload";
import { Request, Response } from "express";
import { Routes, IRoute } from "./shared/routes";

createConnection().then(async connection => {

    require("./auth/passport");

    const app = express();

    app.use(bodyParser.json());
    app.use(fileUpload({
        limits: { fileSize: 5 * 1024 * 1024 },  //== SET THE MAXIMUM UPLOAD SIZE TO 5MB ==//
        safeFileNames: true,
        preserveExtension: 4,
        abortOnLimit: true
    }));

    Routes.forEach((route: IRoute) => {
        if (route.protected) {
            const strategyName = route.admin ? "admin-rule" : "user-rule";
            (app as any)[route.method](route.route, passport.authenticate(strategyName, { session: false }), (req: Request, res: Response, next: Function) => {
                const result = (new (route.controller as any))[route.action](req, res, next);
                if (result instanceof Promise) {
                    result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);
                } else if (result !== null && result !== undefined) {
                    res.json(result);
                }
            });
        } else {
            (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
                const result = (new (route.controller as any))[route.action](req, res, next);
                if (result instanceof Promise) {
                    result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);
                } else if (result !== null && result !== undefined) {
                    res.json(result);
                }
            });
        }
    });

    app.listen(1811);

    console.log("Express server has started on port 1811. Open http://localhost:1811/users to see results");

}).catch(error => console.log(error));
