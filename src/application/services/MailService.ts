export interface MailService {
    send({
        from,
        to,
        subject,
        body,
    }: {
        from: string;
        to: string;
        subject: string;
        body: string;
    }): Promise<void>;
}
