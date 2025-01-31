import { LoginRepository } from "@/src/domain/repositories/LoginRepository";
import { CryptService } from "@/src/application/services/CryptService";
import { BcryptService } from "../../services/BcryptService";
import { PrismaLoginRepository } from "../../repositories/PrismaLoginRepository";
import { ResetPasswordUseCase } from "@/src/application/usecases/ResetPasswordUseCase";

export class ResetPasswordController {
    loginRepository: LoginRepository = new PrismaLoginRepository();
    cryptService: CryptService = new BcryptService();

    resetPasswordUseCase: ResetPasswordUseCase = new ResetPasswordUseCase({
        loginRepository: this.loginRepository,
        cryptService: this.cryptService,
    });

    async handle({
        recoveryToken,
        password,
    }: {
        recoveryToken: string;
        password: string;
    }) {
        return this.resetPasswordUseCase.execute({ recoveryToken, password });
    }
}
