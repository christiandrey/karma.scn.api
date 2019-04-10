import { Attachment } from "nodemailer/lib/mailer";

export class SendEmailConfig {
	to: string | Array<string>;
	subject?: string;
	heading?: string;
	body?: string;
	attachments?: Array<Attachment>;
}
