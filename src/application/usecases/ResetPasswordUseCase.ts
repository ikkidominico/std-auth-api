import { LoginRepository } from "@/src/domain/repositories/LoginRepository";
import { CryptService } from "../services/CryptService";

export class ResetPasswordUseCase {
    loginRepository: LoginRepository;
    cryptService: CryptService;

    constructor(loginRepository: LoginRepository, cryptService: CryptService) {
        this.loginRepository = loginRepository;
        this.cryptService = cryptService;
    }

    async execute(recoveryToken: string, password: string) {
        const login =
            await this.loginRepository.getLocalLoginByRecoveryToken(
                recoveryToken,
            );

        if (!login) throw new Error("Recovery token not found.");

        await this.loginRepository.updatePasswordByUserId(
            login.user.id,
            await this.cryptService.hash(password),
        );
    }
}
