import * as Nodemailer from "nodemailer";

import * as fs from "fs";

import { SendEmailConfig } from "../dto/classes/SendEmailConfig";
import { SentMessageInfo } from "nodemailer/lib/smtp-connection";
import { Constants } from "../shared/constants";
import { Request } from "express";
import { LogService } from "./logService";
import { LogTypeEnum } from "../enums/LogTypeEnum";
import { Methods } from "../shared/methods";
import { Attachment } from "nodemailer/lib/mailer";

export namespace EmailService {
	// -------------------------------------------------------------------------------------------------
	/** Configure the email client and send an email asynchronously */
	export async function sendEmailAsync(req: Request, config: SendEmailConfig): Promise<SentMessageInfo> {
		// --------------------------------------------------------------
		// Configure the email client.
		// --------------------------------------------------------------

		try {
			// const account = await Nodemailer.createTestAccount(); //Using this cause there's no real account yet
			// const transporter = await Nodemailer.createTransport({
			// 	host: "smtp.ethereal.email",
			// 	port: 587,
			// 	secure: false,
			// 	auth: {
			// 		user: account.user,
			// 		pass: account.pass
			// 	}
			// });

			const { server, port, username, password } = Constants.sendGrid;
			const transporter = await Nodemailer.createTransport({
				host: server,
				port,
				secure: true,
				auth: {
					user: username,
					pass: password
				}
			});

			let { to, subject, heading, body, attachments } = config;
			attachments = attachments || new Array<Attachment>();
			const emailContent = getEmailContent(heading, body);
			const sendMailOptions = {
				from: {
					name: "Supply Chain Network",
					address: Constants.emailSender
				},
				to,
				subject,
				html: emailContent,
				attachments: [
					...attachments,
					{
						filename: "logo.png",
						path: Methods.getBaseFolder() + "/emails/img/logo.png",
						cid: "template-logo"
					},
					{
						filename: "rad.png",
						path: Methods.getBaseFolder() + "/emails/img/rad.png",
						cid: "template-avatar"
					},
					{
						filename: "soc_1.png",
						path: Methods.getBaseFolder() + "/emails/img/soc_1.png",
						cid: "template-instagram"
					},
					{
						filename: "soc_2.png",
						path: Methods.getBaseFolder() + "/emails/img/soc_2.png",
						cid: "template-facebook"
					},
					{
						filename: "soc_3.png",
						path: Methods.getBaseFolder() + "/emails/img/soc_3.png",
						cid: "template-twitter"
					},
					{
						filename: "soc_4.png",
						path: Methods.getBaseFolder() + "/emails/img/soc_4.png",
						cid: "template-google-plus"
					}
				]
			} as Nodemailer.SendMailOptions;

			// --------------------------------------------------------------
			// Actually send the email.
			// --------------------------------------------------------------
			return await transporter.sendMail(sendMailOptions);
		} catch (error) {
			await LogService.log(req, "An error occured while sending an email.", error.toString(), LogTypeEnum.Exception);
			return undefined;
		}
	}

	// -------------------------------------------------------------------------------------------------
	/** Configure the email client and send an email synchronously */
	// export function sendEmail(req: Request, config: SendEmailConfig): void {
	// 	// --------------------------------------------------------------
	// 	// Configure the email client.
	// 	// --------------------------------------------------------------
	// 	Nodemailer.createTestAccount((err, account) => {
	// 		const transporter = Nodemailer.createTransport({
	// 			host: "smtp.ethereal.email",
	// 			port: 587,
	// 			secure: false,
	// 			auth: {
	// 				user: account.user,
	// 				pass: account.pass
	// 			}
	// 		});
	// 		const { to, subject, text, html } = config;
	// 		const mailOptions = {
	// 			from: {
	// 				name: "Supply Chain Network",
	// 				address: Constants.emailSender
	// 			},
	// 			to,
	// 			subject,
	// 			text,
	// 			html
	// 		};
	// 		// --------------------------------------------------------------
	// 		// Actually send the email.
	// 		// --------------------------------------------------------------
	// 		transporter.sendMail(mailOptions, (error, info) => {
	// 			if (error) {
	// 				return undefined;
	// 			}
	// 			// console.log("Message sent: %s", info.messageId);
	// 			// console.log("Preview URL: %s", Nodemailer.getTestMessageUrl(info));
	// 		});
	// 	});
	// }

	// -------------------------------------------------------------------------------------------------

	/** Returns an html string that follows the specified template */
	export function getEmailContent(heading: string, body: string): string {
		const emailTemplate = fs.readFileSync(`${Methods.getBaseFolder()}/emails/default.html`, "utf8");
		const emailBody = emailTemplate.replace("::heading::", heading).replace("::body::", body);
		return emailBody;
	}
}
