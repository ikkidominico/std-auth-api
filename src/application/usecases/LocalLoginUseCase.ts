import { LoginRepository } from "@/src/domain/repositories/LoginRepository";
import { CryptService } from "../services/CryptService";
import { CreateTokensUseCase } from "./CreateTokensUseCase";

export class LocalLoginUseCase {
    private readonly loginRepository: LoginRepository;
    private readonly cryptService: CryptService;
    private readonly createTokensUseCase: CreateTokensUseCase;

    constructor({
        loginRepository,
        cryptService,
        createTokensUseCase,
    }: {
        loginRepository: LoginRepository;
        cryptService: CryptService;
        createTokensUseCase: CreateTokensUseCase;
    }) {
        this.loginRepository = loginRepository;
        this.cryptService = cryptService;
        this.createTokensUseCase = createTokensUseCase;
    }

    async execute({ email, password }: { email: string; password: string }) {
        const loginExists = await this.loginRepository.getLocalLoginByEmail({
            email,
        });

        if (!loginExists) throw new Error("Local login not found.");

        const isLoginValid = await this.cryptService.verify({
            text: password,
            hash: loginExists.password!,
        });

        if (!isLoginValid) {
            throw new Error("Invalid email and/or password");
        }

        return await this.createTokensUseCase.execute({
            userId: loginExists.user.id,
            email: loginExists.user.email,
        });
    }
}
