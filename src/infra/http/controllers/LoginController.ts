import LocalLoginUseCase from "@/src/application/usecases/LocalLoginUseCase";
import LoginRepository from "@/src/domain/repositories/LoginRepository";
import CryptService from "@/src/application/services/CryptService";
import BcryptService from "../../services/BcryptService";
import JwtService from "@/src/application/services/JwtService";
import JsonWebTokenService from "../../services/JsonWebTokenService";
import PrismaLoginRepository from "../../repositories/PrismaLoginRepository";
import CreateRefreshTokenUseCase from "@/src/application/usecases/CreateRefreshTokenUseCase";
import RefreshTokenRepository from "@/src/domain/repositories/RefreshTokenRepository";
import PrismaRefreshTokenRepository from "../../repositories/PrismaRefreshTokenRepository";

export default class LoginController {
    loginRepository: LoginRepository = new PrismaLoginRepository();
    refreshTokenRepository: RefreshTokenRepository =
        new PrismaRefreshTokenRepository();
    cryptService: CryptService = new BcryptService();
    jwtService: JwtService = new JsonWebTokenService();
    createRefreshTokenUseCase: CreateRefreshTokenUseCase =
        new CreateRefreshTokenUseCase(this.refreshTokenRepository);
    localLoginUseCase: LocalLoginUseCase = new LocalLoginUseCase(
        this.loginRepository,
        this.cryptService,
        this.jwtService,
        this.createRefreshTokenUseCase,
    );
    async postLocalLogin(email: string, password: string) {
        return this.localLoginUseCase.execute({ email, password });
    }
}
