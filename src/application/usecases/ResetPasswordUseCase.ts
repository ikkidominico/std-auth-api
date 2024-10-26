import { LoginRepository } from "@/src/domain/repositories/LoginRepository";
import { CryptService } from "../services/CryptService";

export class ResetPasswordUseCase {
    private readonly loginRepository: LoginRepository;
    private readonly cryptService: CryptService;

    constructor({
        loginRepository,
        cryptService,
    }: {
        loginRepository: LoginRepository;
        cryptService: CryptService;
    }) {
        this.loginRepository = loginRepository;
        this.cryptService = cryptService;
    }

    async execute({
        recoveryToken,
        password,
    }: {
        recoveryToken: string;
        password: string;
    }) {
        const loginExists =
            await this.loginRepository.getLocalLoginByRecoveryToken({
                recoveryToken,
            });

        if (!loginExists) throw new Error("Recovery token not found.");

        await this.loginRepository.updateLoginByUserId({
            password: await this.cryptService.hash({ text: password }),
            userId: loginExists.user.id,
        });
    }
}
