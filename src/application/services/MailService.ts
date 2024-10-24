export interface MailService {
    send(
        from: string,
        to: string,
        subject: string,
        body: string,
    ): Promise<void>;
}
