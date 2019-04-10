export namespace Constants {
	export const cipherKey = "__REDACTED__";

	export const emailSender = "__REDACTED__";

	export const passwordHashCipherKey = "__REDACTED__";

	export const cloudinary = {
		cloudName: "__REDACTED__",
		apiKey: "__REDACTED__",
		apiSecret: "__REDACTED__",
		environmentVariable: "__REDACTED__"
	};

	export const sendGrid = {
		apiKey: "__REDACTED__",
		server: "__REDACTED__",
		port: 465,
		username: "__REDACTED__",
		password: "__REDACTED__"
	};

	export const locationEverywhere = "everywhere";

	export const categoryAll = "all";

	export const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"];

	export const documentExtensions = [".pdf"];

	export const paths = {
		imageUploadPath: "/uploads/images/",

		documentUploadPath: "/uploads/documents/"
	};

	export const sortedTimelinePosts = "sortedTimelinePosts";

	export const cronJobs = "cronJobs";

	export const commentsTree = "commentsTree";

	export const redisURL = "__REDACTED__";

	export const redisTTL = 3600;

	export const seedKey = "__REDACTED__";

	export const emailButton = `<table class="mob_btn" cellpadding="0" cellspacing="0" border="0" style="background: #27cbcc; border-radius: 4px;"> <tr> <td align="center" valign="top"> <a href="::buttonHref::" target="_blank" style="display: block; border: 1px solid #27cbcc; border-radius: 4px; padding: 12px 23px; font-family: 'Source Sans Pro', Arial, Verdana, Tahoma, Geneva, sans-serif; color: #ffffff; font-size: 20px; line-height: 30px; text-decoration: none; white-space: nowrap; font-weight: 600;"> <font face="'Source Sans Pro', sans-serif" color="#ffffff" style="font-size: 20px; line-height: 30px; text-decoration: none; white-space: nowrap; font-weight: 600;"> <span style="font-family: 'Source Sans Pro', Arial, Verdana, Tahoma, Geneva, sans-serif; color: #ffffff; font-size: 20px; line-height: 30px; text-decoration: none; white-space: nowrap; font-weight: 600;">::buttonTitle::</span> </font> </a> </td> </tr> </table>`;

	export const welcomeEmailContent =
		"Welcome to the Supply Chain Network! <p>It’s always a good idea to reinforce a subscriber’s decision to sign up for your emails. One easy way to do that is to offer a quick “perks list,” which tells subscribers why joining your email list was a great idea. Office furniture and supply store Poppin does a great job of explaining the benefits of signing up for their emails, displaying the signup perks in digestible bullet points. The copy is also unique and full of personality.</p>";

	export const birthdayEmailContent = "Hooray - it's your Birthday! <p>We wish you much happiness on your special day. Have an unforgettable birthday!</p>";

	export const webinarReminderEmailContent = "<p>We thought to remind you that the webinar, <i>::webinar-topic::</i>, starts in one hour.</p>" + emailButton;
}
