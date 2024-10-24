import { LoginRepository } from "@/src/domain/repositories/LoginRepository";
import { CryptService } from "@/src/application/services/CryptService";
import { BcryptService } from "../../services/BcryptService";
import { PrismaLoginRepository } from "../../repositories/PrismaLoginRepository";
import { PasswordRecoveryUseCase } from "@/src/application/usecases/PasswordRecoveryUseCase";
import { MailService } from "@/src/application/services/MailService";
import { NodeMailerService } from "../../services/NodeMailerService";

export class PasswordRecoveryController {
    loginRepository: LoginRepository = new PrismaLoginRepository();
    cryptService: CryptService = new BcryptService();
    mailService: MailService = new NodeMailerService();

    passwordRecoveryUseCase: PasswordRecoveryUseCase =
        new PasswordRecoveryUseCase(
            this.loginRepository,
            this.cryptService,
            this.mailService,
        );

    async handle(email: string) {
        return this.passwordRecoveryUseCase.execute(email);
    }
}
