import { LoginRepository } from "@/src/domain/repositories/LoginRepository";
import { MailService } from "../services/MailService";
import { CryptService } from "../services/CryptService";

export class PasswordRecoveryUseCase {
    loginRepository: LoginRepository;
    cryptService: CryptService;
    mailService: MailService;

    constructor(
        loginRepository: LoginRepository,
        cryptService: CryptService,
        mailService: MailService,
    ) {
        this.loginRepository = loginRepository;
        this.cryptService = cryptService;
        this.mailService = mailService;
    }

    async execute(email: string) {
        const login = await this.loginRepository.getLocalLoginByEmail(email);

        if (!login) throw new Error("Email not found.");

        const recoveryToken = await this.cryptService.randomToken();

        await this.loginRepository.updateRecoveryTokenByUserId(
            login.user.id,
            recoveryToken,
        );

        await this.mailService.send(
            "'Standard Authentication API' <std-auth-api@email.com>",
            "test@email.com",
            "Password Recovery",
            `Recovery Password Token: ${recoveryToken}`,
        );
    }
}
