import { LoginRepository } from "@/src/domain/repositories/LoginRepository";
import { PrismaLoginRepository } from "../../repositories/PrismaLoginRepository";
import { DeleteLoginUseCase } from "@/src/application/usecases/DeleteLoginUseCase";

export class DeleteLoginController {
    loginRepository: LoginRepository = new PrismaLoginRepository();
    deleteLoginUseCase: DeleteLoginUseCase = new DeleteLoginUseCase({
        loginRepository: this.loginRepository,
    });

    async handle({ userId, method }: { userId: string; method: string }) {
        return this.deleteLoginUseCase.execute({ userId, method });
    }
}
