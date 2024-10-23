import LocalLoginUseCase from "@/src/application/usecases/LocalLoginUseCase";
import LoginRepository from "@/src/domain/repositories/LoginRepository";
import CryptService from "@/src/application/services/CryptService";
import BcryptService from "../../services/BcryptService";
import JwtService from "@/src/application/services/JwtService";
import JsonWebTokenService from "../../services/JsonWebTokenService";
import PrismaLoginRepository from "../../repositories/PrismaLoginRepository";

export default class LoginController {
    loginRepository: LoginRepository = new PrismaLoginRepository();
    cryptService: CryptService = new BcryptService();
    jwtService: JwtService = new JsonWebTokenService();
    localLoginUseCase: LocalLoginUseCase = new LocalLoginUseCase(
        this.loginRepository,
        this.cryptService,
        this.jwtService,
    );
    async postLocalLogin(email: string, password: string) {
        return this.localLoginUseCase.execute(email, password);
    }
}
