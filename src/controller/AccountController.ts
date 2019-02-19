import * as bcrypt from "bcrypt";
import * as passport from "passport";
import * as moment from "moment";
import { NextFunction, Request, Response } from "express";
import { User } from "../entities/User";
import { getRepository } from "typeorm";
import { IVerifyOptions } from "passport-local";
import { FormResponse } from "../dto/classes/FormResponse";
import { Methods } from "../shared/methods";
import { RegisterDetails } from "../dto/classes/RegisterDetails";
import { validate } from "class-validator";
import { UserService } from "../services/userService";
import { UserTypeEnum } from "../enums/UserTypeEnum";
import { Address } from "../entities/Address";
import { Country } from "../entities/Country";
import { LogService } from "../services/logService";
import { Constants } from "../shared/constants";
import { CronService } from "../services/cronService";
import { CronJobTypeEnum } from "../enums/CronJobTypeEnum";

export class AccountController {
	private userRepository = getRepository(User);

	async login(req: Request, resp: Response, next: NextFunction) {
		passport.authenticate("local", { session: false }, (error, user: User, info: IVerifyOptions) => {
			if (!user) {
				const { message } = info;
				const response = new FormResponse({
					isValid: false,
					errors: [message]
				});

				return resp.json(Methods.getJsonResponse(response, message, false));
			}

			req.login(user, { session: false }, error => {
				if (!!error) {
					const response = new FormResponse({
						isValid: false,
						errors: [error.toString()]
					});

					return resp.json(Methods.getJsonResponse(response, error.toString(), false));
				}

				const token = UserService.getUserToken(user);
				const response = new FormResponse<string>({
					isValid: true,
					target: token
				});

				return resp.json(Methods.getJsonResponse(response, "Logged in successfully"));
			});
		})(req, resp);
	}

	async register(req: Request, resp: Response, next: NextFunction) {
		const registerDetails = new RegisterDetails(req.body);
		const validationResult = await validate(registerDetails);

		if (validationResult.length) {
			const response = new FormResponse({
				isValid: false,
				errors: Methods.getValidationErrors(validationResult).map(e => e.constraints && e.constraints[Object.keys(e.constraints)[0]])
			});

			return Methods.getJsonResponse(response, "Invalid sign in details", false);
		}

		if (registerDetails.type === UserTypeEnum.Admin) {
			Methods.sendErrorResponse(resp, 400, "Bad Request");
			return;
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
			const { firstName, lastName, email, password, type, phone, address, dateOfBirth } = registerDetails;
			const user = new User({
				firstName,
				lastName,
				type,
				phone,
				dateOfBirth,
				verified: false,
				address: new Address({
					city: Methods.toSentenceCase(address.city),
					state: Methods.toSentenceCase(address.state),
					country: new Country({ id: address.country.id })
				} as Address),
				email: email.toLowerCase()
			});

			user.password = await bcrypt.hash(password, 2);

			dbUser = await this.userRepository.save(user);

			// ---------------------------------------------------------------
			// Schedule Email and Birthday Jobs
			// ---------------------------------------------------------------

			const timeToSendWelcomeEmail = moment()
				.add(1, "minutes")
				.toDate();
			const userDateOfBirthDay = new Date(dateOfBirth).getDate();
			const userDateOfBirthMonth = new Date(dateOfBirth).getMonth();

			await CronService.scheduleJob(req, `0 0 ${userDateOfBirthDay} ${userDateOfBirthMonth + 1} *`, CronJobTypeEnum.BirthdayMessage, [email, firstName]);
			await CronService.scheduleJobWithDate(req, timeToSendWelcomeEmail, CronJobTypeEnum.WelcomeEmail, [email, firstName]);
			await LogService.log(req, `${user.firstName} ${user.lastName} just signed up as a ${UserTypeEnum[user.type]}.`);

			const token = UserService.getUserToken(user);
			const response = new FormResponse<string>({
				isValid: true,
				target: token
			});

			return Methods.getJsonResponse(response, "New user was created successfully");
		}
	}

	async seedAsync(req: Request, resp: Response, next: NextFunction) {
		const key = req.params.key;

		if (key !== Constants.seedKey) {
			Methods.sendErrorResponse(resp, 401);
			return;
		}

		const user = new User({
			firstName: "Admin",
			lastName: "User",
			type: UserTypeEnum.Admin,
			phone: "08144398813",
			dateOfBirth: new Date("1990-10-30T02:41:17.396Z"),
			verified: true,
			address: new Address({
				city: "Ikeja",
				state: "Lagos",
				country: new Country({ id: "d44199d3-c6ef-421c-b63d-0ff47dddc3bb" })
			}),
			email: "admin@supplychainnetwork.com"
		} as User);

		user.password = await bcrypt.hash("cxBeNT7czs4iOMXsQ25D", 2);

		await this.userRepository.save(user);

		return Methods.getJsonResponse({}, "Seed complete");
	}
}
