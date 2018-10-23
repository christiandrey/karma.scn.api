import { NextFunction, Request, Response } from "express";
import { User } from "../entities/User";
import { getRepository } from "typeorm";
import * as passport from "passport";
import { IVerifyOptions } from "passport-local";
import * as JWT from "jsonwebtoken";
import { Constants } from "../shared/constants";
import { FormResponse } from "../dto/classes/FormResponse";
import { Methods } from "../shared/methods";
import { RegisterDetails } from "../dto/classes/RegisterDetails";
import { validate } from "class-validator";
import * as bcrypt from "bcrypt";
import { SendEmailConfig } from "../dto/classes/SendEmailConfig";
import { EmailService } from "../services/emailService";

export class AccountController {

    private userRepository = getRepository(User);

    async login(req: Request, resp: Response, next: NextFunction) {
        passport.authenticate("local", { session: false }, (error, user: User, info: IVerifyOptions) => {
            if (!user) {
                const { message } = info;
                const response = new FormResponse();

                response.isValid = false;
                response.errors = [message];

                return resp.json(Methods.getJsonResponse(response, message, false));
            }

            req.login(user, { session: false }, (error) => {
                if (!!error) {
                    const response = new FormResponse();

                    response.isValid = false;
                    response.errors = [error.toString()];

                    return resp.json(Methods.getJsonResponse(response, error.toString(), false));
                }

                const token = this.getUserToken(user);
                const response = new FormResponse<string>();

                response.isValid = true;
                response.target = token;

                return resp.json(Methods.getJsonResponse(response, "Logged in successfully"));
            });
        })(req, resp);
    }

    async register(req: Request, resp: Response, next: NextFunction) {
        const registerDetails = req.body as RegisterDetails;
        const validationResult = await validate(registerDetails);

        if (validationResult.length) {
            const response = new FormResponse();

            response.isValid = false;
            response.errors = validationResult.map(x => x.toString());

            return Methods.getJsonResponse(response, "Invalid sign in details", false);
        }

        const { email } = registerDetails;
        let dbUser = await this.userRepository.findOne({ email });

        if (!!dbUser) {
            const response = new FormResponse({
                isValid: false,
                errors: ["A user with this email already exists"]
            });

            return Methods.getJsonResponse(response, "A user with this email already exists", false);
        } else {
            const { firstName, lastName, email, password, type, phone } = registerDetails;
            const user = new User();

            user.firstName = firstName;
            user.lastName = lastName;
            user.email = email.toLowerCase();
            user.password = await bcrypt.hash(password, 2);
            user.type = type;
            user.phone = phone;

            dbUser = await this.userRepository.save(user);

            // const sendEmailConfig = {
            //     to: user.email,
            //     subject: "Welcome to SCN",
            //     text: "Welcome to the Supply Chain Network"
            // } as SendEmailConfig;

            // const emailResponse = await EmailService.sendEmailAsync(sendEmailConfig);

            const token = this.getUserToken(dbUser);
            const response = new FormResponse<string>({
                isValid: true,
                target: token
            });

            return Methods.getJsonResponse(response, "New user was created successfully");
        }
    }

    private getUserToken(user: User): string {
        return JWT.sign({
            id: user.id,
            email: user.email
        }, Constants.cipherKey, {
                expiresIn: "7 days"
            });
    }
}