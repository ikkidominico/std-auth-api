import nodemailer from "nodemailer";
import { MailService } from "@/src/application/services/MailService";
import Mail from "nodemailer/lib/mailer";

export class NodeMailerService implements MailService {
    transporter: Mail;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "localhost",
            port: 2525,
            secure: false,
        });
    }

    async send(
        from: string,
        to: string,
        subject: string,
        body: string,
    ): Promise<void> {
        await this.transporter.sendMail({
            from,
            to,
            subject,
            html: body,
        });
    }
}
