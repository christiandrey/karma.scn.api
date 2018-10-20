// import { NextFunction, Request, Response } from "express";
// import { User } from "../entity/User";
// import { getRepository } from "typeorm";
// import * as passport from "passport";
// import { IVerifyOptions } from "passport-local";
// import * as JWT from "jsonwebtoken";
// import { Constants } from "../constants";

// export class AuthController {

//     private userRepository = getRepository(User);

//     async login(req: Request, resp: Response, next: NextFunction) {
//         passport.authenticate("local", {
//             session: false
//         }, (error, user: User, info: IVerifyOptions) => {
//             if (!user) {
//                 const { message } = info;
//                 const response = { message };
//                 return resp.status(400).json(response);
//             }

//             req.login(user, {
//                 session: false
//             }, error => {
//                 if (!!error) {
//                     resp.send(error);
//                 }
//                 const token = this.getUserToken(user);
//                 const response = { token };
//                 return resp.json(response);
//             });
//         })(req, resp);
//     }

//     async register(req: Request, resp: Response, next: NextFunction) {
//         const user = req.body as User;
//         const { email } = user;
//         let dbUser = await this.userRepository.findOne({ email });

//         if (!!dbUser) {
//             const response = {
//                 message: "A user with this email already exists"
//             }
//             return response;
//         } else {
//             dbUser = await this.userRepository.save(user);
//             const token = this.getUserToken(dbUser);
//             const response = { token };
//             return response;
//         }
//     }

//     private getUserToken(user: User): string {
//         return JWT.sign({
//             id: user.id,
//             email: user.email
//         }, Constants.cipherKey);
//     }
// }