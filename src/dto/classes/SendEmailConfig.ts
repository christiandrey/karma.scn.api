export class SendEmailConfig {
    to: string | Array<string>;
    subject?: string;
    text?: string;
    html?: string;
}