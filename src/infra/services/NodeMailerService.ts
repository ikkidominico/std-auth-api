import nodemailer from "nodemailer";
import { MailService } from "@/src/application/services/MailService";
import Mail from "nodemailer/lib/mailer";

export class NodeMailerService implements MailService {
    transporter: Mail;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || process.env.TEST_SMTP_HOST,
            port:
                Number(process.env.SMTP_PORT) ||
                Number(process.env.TEST_SMTP_PORT),
            secure: false,
        });
    }

    async send({
        from,
        to,
        subject,
        body,
    }: {
        from: string;
        to: string;
        subject: string;
        body: string;
    }): Promise<void> {
        await this.transporter.sendMail({
            from,
            to,
            subject,
            html: body,
        });
    }
}
