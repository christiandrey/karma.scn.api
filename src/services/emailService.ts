import * as Nodemailer from "nodemailer";

import { SendEmailConfig } from "../dto/classes/SendEmailConfig";
import { SentMessageInfo } from "nodemailer/lib/smtp-connection";
import { Constants } from "../shared/constants";

export namespace EmailService {

    // -------------------------------------------------------------------------------------------------
    /** Configure the email client and send an email asynchronously */
    export async function sendEmailAsync(config: SendEmailConfig): Promise<SentMessageInfo> {

        // --------------------------------------------------------------
        // Configure the email client. 
        // --------------------------------------------------------------

        try {
            const account = await Nodemailer.createTestAccount(); //Using this cause there's no real account yet
            const transporter = await Nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            });

            // const transporter = await Nodemailer.createTransport({
            //     host: 'smtp.gmail.com',
            //     port: 587,
            //     secure: false,
            //     auth: {
            //         user: "blaise.disposables@gmail.com",
            //         pass: "loremIPSUM2012"
            //     }
            // });

            const { to, subject, text, html } = config;
            const sendMailOptions = {
                from: {
                    name: "Supply Chain Network",
                    address: Constants.emailSender
                },
                to, subject, text, html
            } as Nodemailer.SendMailOptions;

            // --------------------------------------------------------------
            // Actually send the email.
            // --------------------------------------------------------------
            return await transporter.sendMail(sendMailOptions);

        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    // -------------------------------------------------------------------------------------------------
    /** Configure the email client and send an email synchronously */
    export function sendEmail(config: SendEmailConfig): void {

        // --------------------------------------------------------------
        // Configure the email client. 
        // --------------------------------------------------------------
        Nodemailer.createTestAccount((err, account) => {

            const transporter = Nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            });
            const { to, subject, text, html } = config;
            const mailOptions = {
                from: {
                    name: "Supply Chain Network",
                    address: Constants.emailSender
                },
                to, subject, text, html
            };
            // --------------------------------------------------------------
            // Actually send the email.
            // --------------------------------------------------------------
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', Nodemailer.getTestMessageUrl(info));
            });
        });
    }
}