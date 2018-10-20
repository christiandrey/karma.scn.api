// import * as passport from "passport";
// import { Strategy, ExtractJwt, StrategyOptions, VerifiedCallback } from "passport-jwt";
// import * as PassportLocal from "passport-local";
// import { getRepository } from "typeorm";
// import { User } from "../entities/User";
// import { Constants } from "../shared/constants";

// const LocalStrategy = PassportLocal.Strategy;
// const userRepository = getRepository(User);

// // ---------------------------------------------------
// // LOCAL STRATEGY
// // ---------------------------------------------------

// passport.use(new LocalStrategy({
//     usernameField: 'email',
//     passwordField: 'password'
// }, async (email: string, password: string, callback: any) => {
//     const user = await userRepository.findOne({ email, password });
//     if (!!user) {
//         return callback(null, user, {
//             message: "Logged In Successfully"
//         });
//     }
//     else {
//         return callback(null, null, {
//             message: "Incorrect email or password"
//         });
//     }
// }));

// // ---------------------------------------------------
// // JWT STRATEGY
// // ---------------------------------------------------

// passport.use(new Strategy({
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey: Constants.cipherKey
// }, async (jwtPayload: any, callback: VerifiedCallback) => {
//     const id = jwtPayload.id;
//     const user = await userRepository.findOne({ id });

//     return callback(null, user);
// }));