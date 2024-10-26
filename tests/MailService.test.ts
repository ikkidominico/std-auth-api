import { MailService } from "@/src/application/services/MailService";
import { NodeMailerService } from "@/src/infra/services/NodeMailerService";
import { it } from "vitest";

it("Should send an email", async () => {
    const mailService: MailService = new NodeMailerService();
    await mailService.send({
        from: "'Standard Authentication API' <std-auth-api@email.com>",
        to: "test@email.com",
        subject: "Email Service Test",
        body: "Hi, this is an email test!",
    });
});
