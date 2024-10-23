import LoginRepository from "@/src/domain/repositories/LoginRepository";
import CryptService from "@/src/application/services/CryptService";
import BcryptService from "../../services/BcryptService";
import LocalSignUpUseCase from "@/src/application/usecases/LocalSignupUseCase";
import CreateUserUseCase from "@/src/application/usecases/CreateUserUseCase";
import UserRepository from "@/src/domain/repositories/UserRepository";
import PrismaUserRepository from "../../repositories/PrismaUserRepository";
import PrismaLoginRepository from "../../repositories/PrismaLoginRepository";

export default class SignUpController {
    userRepository: UserRepository = new PrismaUserRepository();
    loginRepository: LoginRepository = new PrismaLoginRepository();
    cryptService: CryptService = new BcryptService();
    createUserUseCase: CreateUserUseCase = new CreateUserUseCase(
        this.userRepository,
    );
    localSignUpUseCase: LocalSignUpUseCase = new LocalSignUpUseCase(
        this.userRepository,
        this.loginRepository,
        this.createUserUseCase,
        this.cryptService,
    );
    async postLocalSignUp(email: string, password: string) {
        return this.localSignUpUseCase.execute(email, password);
    }
}
