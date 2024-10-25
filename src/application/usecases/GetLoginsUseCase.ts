import { LoginRepository } from "@/src/domain/repositories/LoginRepository";

export class GetLoginsUseCase {
    loginRepository: LoginRepository;

    constructor(loginRepository: LoginRepository) {
        this.loginRepository = loginRepository;
    }

    async execute(userId: string) {
        const logins = await this.loginRepository.getLoginsByUserId(userId);
        if (!logins) throw new Error("Logins not found.");
        return logins;
    }
}
