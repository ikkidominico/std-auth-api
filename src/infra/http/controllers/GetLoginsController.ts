import { LoginRepository } from "@/src/domain/repositories/LoginRepository";
import { PrismaLoginRepository } from "../../repositories/PrismaLoginRepository";
import { GetLoginsUseCase } from "@/src/application/usecases/GetLoginsUseCase";

export class GetLoginsController {
    loginRepository: LoginRepository = new PrismaLoginRepository();
    getLoginsUseCase: GetLoginsUseCase = new GetLoginsUseCase(
        this.loginRepository,
    );

    async handle(userId: string) {
        return this.getLoginsUseCase.execute(userId);
    }
}
