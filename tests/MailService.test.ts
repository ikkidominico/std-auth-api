import { MailService } from "@/src/application/services/MailService";
import { NodeMailerService } from "@/src/infra/services/NodeMailerService";
import { test } from "vitest";

test("Should send an email", async () => {
    const mailService: MailService = new NodeMailerService();
    await mailService.send(
        "'Standard Authentication API' <std-auth-api@email.com>",
        "test@email.com",
        "Email Service Test",
        "Hi, this is an email test!",
    );
});
