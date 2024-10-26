import { LoginRepository } from "@/src/domain/repositories/LoginRepository";
import { MailService } from "../services/MailService";
import { CryptService } from "../services/CryptService";

export class PasswordRecoveryUseCase {
    private readonly loginRepository: LoginRepository;
    private readonly cryptService: CryptService;
    private readonly mailService: MailService;

    constructor({
        loginRepository,
        cryptService,
        mailService,
    }: {
        loginRepository: LoginRepository;
        cryptService: CryptService;
        mailService: MailService;
    }) {
        this.loginRepository = loginRepository;
        this.cryptService = cryptService;
        this.mailService = mailService;
    }

    async execute({ email }: { email: string }) {
        const loginExists = await this.loginRepository.getLocalLoginByEmail({
            email,
        });

        if (!loginExists) throw new Error("Login not found.");

        const recoveryToken = await this.cryptService.randomToken();

        await this.loginRepository.updateLoginByUserId({
            recoveryToken,
            userId: loginExists.user.id,
        });

        await this.mailService.send({
            from: "'Standard Authentication API' <std-auth-api@email.com>",
            to: "test@email.com",
            subject: "Password Recovery",
            body: recoveryToken,
        });
    }
}
