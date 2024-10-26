import { LoginRepository } from "@/src/domain/repositories/LoginRepository";

export class GetLoginsUseCase {
    private readonly loginRepository: LoginRepository;

    constructor({ loginRepository }: { loginRepository: LoginRepository }) {
        this.loginRepository = loginRepository;
    }

    public async execute({ userId }: { userId: string }) {
        const logins = await this.loginRepository.getLoginsByUserId({ userId });
        if (!logins) throw new Error("Logins not found.");
        return logins;
    }
}
