import { LoginRepository } from "@/src/domain/repositories/LoginRepository";

export class DeleteLoginUseCase {
    private readonly loginRepository: LoginRepository;

    constructor({ loginRepository }: { loginRepository: LoginRepository }) {
        this.loginRepository = loginRepository;
    }

    async execute({ userId, method }: { userId: string; method: string }) {
        const logins = await this.loginRepository.getLoginsByUserId({ userId });

        if (logins.length <= 1)
            throw new Error("You must have at least one login method.");

        const index = logins.findIndex(
            (login) => login.user.id === userId && login.method === method,
        );

        const login = logins[index];

        if (!login) throw new Error("Login not found");

        await this.loginRepository.deleteLoginById({ id: login.id });
    }
}
