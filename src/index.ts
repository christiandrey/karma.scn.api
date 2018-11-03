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
import { Comment } from "./entities/Comment";
import { appendFile } from "graceful-fs";

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
		// var whitelist = [
		// 	"http://localhost:1313",
		// 	"http://localhost:1810",
		// 	"192.168.8.106:1313/viz",
		// 	"http://192.168.8.106:1313/viz"
		// ];
		// var options = {
		// 	credentials: true,
		// 	origin: function(origin, callback) {
		// 		if (whitelist.indexOf(origin) !== -1) {
		// 			callback(null, true);
		// 		} else {
		// 			callback(new Error("Not allowed by CORS"));
		// 		}
		// 	}
		// };
		// app.use(cors(options));
		app.use(cors());

		// ----------------------------------------------------------------------
		// Socket.io
		// ----------------------------------------------------------------------
		const server = require("http").createServer(app);
		let io = require("socket.io")(server) as socketio.Server;

		io.on("connection", async socket => {
			// var wstream = createWriteStream('myBinaryFile.webm', {
			//     flags: "a"
			// });
			await SocketService.createSocketRecord(socket.request, socket.id);

			socket.on(
				"webinarComment",
				async (comment: Comment, urlToken: string) => {
					const createdComment = await SocketService.addWebinarComment(
						socket.request,
						comment,
						urlToken
					);

					if (!!createdComment) {
						socket.broadcast.emit("webinarComment", createdComment);
					}
				}
			);

			socket.on(
				"discussionComment",
				async (comment: Comment, urlToken: string) => {
					const createdComment = await SocketService.addDiscussionComment(
						socket.request,
						comment,
						urlToken
					);

					if (!!createdComment) {
						socket.broadcast.emit(
							"discussionComment",
							createdComment
						);
					}
				}
			);

			socket.on("disconnect", async () => {
				// wstream.end();
				await SocketService.deleteSocketRecord(socket.id);
			});

			// socket.on("streamWebinar", video => {
			//     // console.log(video);
			//     socket.broadcast.emit("streamWebinar", video);
			//     try {
			//         // wstream.write(video);
			//         appendFile(`myVideo.webm`, video, () => {
			//             console.log(video);
			//         });
			//     } catch (error) {
			//         console.log(error);
			//     }
			//     //TODO: STream to file
			// });
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
				(app as any)[route.method](
					route.route,
					passport.authenticate(strategyName, { session: false }),
					(req: Request, res: Response, next: Function) => {
						const result = new (route.controller as any)()[
							route.action
						](req, res, next);
						if (result instanceof Promise) {
							result.then(
								result =>
									result !== null && result !== undefined
										? res.send(result)
										: undefined
							);
						} else if (result !== null && result !== undefined) {
							res.json(result);
						}
					}
				);
			} else {
				(app as any)[route.method](
					route.route,
					(req: Request, res: Response, next: Function) => {
						const result = new (route.controller as any)()[
							route.action
						](req, res, next);
						if (result instanceof Promise) {
							result.then(
								result =>
									result !== null && result !== undefined
										? res.send(result)
										: undefined
							);
						} else if (result !== null && result !== undefined) {
							res.json(result);
						}
					}
				);
			}
		});

		server.listen(1811);

		console.log(
			"Express server has started on port 1811. Open http://localhost:1811/users to see results"
		);
	})
	.catch(error => console.log(error));
