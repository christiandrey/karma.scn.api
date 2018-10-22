import * as passport from "passport";
import { Strategy, ExtractJwt, VerifiedCallback } from "passport-jwt";
import * as PassportLocal from "passport-local";
import { getRepository } from "typeorm";
import { User } from "../entities/User";
import { Constants } from "../shared/constants";
import { Methods } from "../shared/methods";
import * as bcrypt from "bcrypt";

const LocalStrategy = PassportLocal.Strategy;
const userRepository = getRepository(User);

// ---------------------------------------------------
// LOCAL STRATEGY
// ---------------------------------------------------

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email: string, password: string, callback: any) => {

    const validationResult = await Methods.validateEmail(email);

    if (!validationResult) {
        return callback(null, null, {
            message: "Please enter a valid email address"
        });
    }

    const user = await userRepository.findOne({ email });

    if (!!user) {
        const passwordValidationResult = await bcrypt.compare(password, user.password);
        if (passwordValidationResult) {
            return callback(null, user, {
                message: "Logged in successfully"
            });
        }
    }

    return callback(null, null, {
        message: "Incorrect email or password"
    });
}));

// ---------------------------------------------------
// JWT STRATEGY
// ---------------------------------------------------

passport.use(new Strategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: Constants.cipherKey
}, async (jwtPayload: any, callback: VerifiedCallback) => {
    const id = jwtPayload.id;
    const user = await userRepository.findOne({ id });

    return callback(null, user);
}));