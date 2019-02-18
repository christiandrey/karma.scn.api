// import "./prototypes/prototypes";
import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as socketio from "socket.io";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import * as passport from "passport";
import * as fileUpload from "express-fileupload";
import { Request, Response } from "express";
import { Routes, IRoute } from "./shared/routes";
import { SocketService } from "./services/socketService";
import { Constants } from "./shared/constants";
import { User } from "./entities/User";
import { VerifiedCallback } from "passport-jwt";

createConnection()
	.then(async connection => {
		require("./auth/passport");

		const app = express();

		app.use(bodyParser.json());

		// ----------------------------------------------------------------------
		// File upload
		// ----------------------------------------------------------------------

		app.use(
			fileUpload({
				limits: { fileSize: 5 * 1024 * 1024 }, //== SET THE MAXIMUM UPLOAD SIZE TO 5MB ==//
				safeFileNames: true,
				preserveExtension: 4,
				abortOnLimit: true
			})
		);

		// ----------------------------------------------------------------------
		// CORS
		// ----------------------------------------------------------------------

		app.use(cors());

		// ----------------------------------------------------------------------
		// Socket.io
		// ----------------------------------------------------------------------
		const server = require("http").createServer(app);
		let io = require("socket.io")(server) as socketio.Server;
		var jwtAuth = require("socketio-jwt-auth");

		// ----------------------------------------------------------------------
		// Authenticate request
		// ----------------------------------------------------------------------

		io.use(
			jwtAuth.authenticate(
				{
					secret: Constants.cipherKey,
					algorithm: "HS256"
				},
				async (payload: any, done: VerifiedCallback) => {
					const user = await connection.manager.findOne(User, payload.id);
					if (!!user) {
						const authenticatedUser = new User();
						authenticatedUser.id = user.id;
						authenticatedUser.type = user.type;
						return done(null, authenticatedUser);
					}
					return done(null, null);
				}
			)
		);

		io.on("connection", async socket => {
			await SocketService.createSocketRecord(socket.request, socket.id);

			socket.on("disconnect", async () => {
				await SocketService.deleteSocketRecord(socket.id);
			});
		});

		app.use((req: Request, res, next) => {
			req.io = io;
			next();
		});

		// ----------------------------------------------------------------------
		// Routing
		// ----------------------------------------------------------------------

		Routes.forEach((route: IRoute) => {
			if (!!route.protected) {
				const strategyName = !!route.admin ? "admin-rule" : "user-rule";
				(app as any)[route.method](route.route, passport.authenticate(strategyName, { session: false }), (req: Request, res: Response, next: Function) => {
					const result = new (route.controller as any)()[route.action](req, res, next);
					if (result instanceof Promise) {
						result.then(result => (result !== null && result !== undefined ? res.send(result) : undefined));
					} else if (result !== null && result !== undefined) {
						res.json(result);
					}
				});
			} else {
				(app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
					const result = new (route.controller as any)()[route.action](req, res, next);
					if (result instanceof Promise) {
						result.then(result => (result !== null && result !== undefined ? res.send(result) : undefined));
					} else if (result !== null && result !== undefined) {
						res.json(result);
					}
				});
			}
		});

		// ----------------------------------------------------------------------
		// Restart all CRON jobs
		// ----------------------------------------------------------------------

		const port = process.env.PORT || 1811;

		server.listen(port);

		console.log("Express server has started on port %s. Open http://localhost:%s/users to see results", port, port);
	})
	.catch(error => console.log(error));
