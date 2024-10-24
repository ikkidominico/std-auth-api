import { LocalLoginUseCase } from "@/src/application/usecases/LocalLoginUseCase";
import { LoginRepository } from "@/src/domain/repositories/LoginRepository";
import { CryptService } from "@/src/application/services/CryptService";
import { BcryptService } from "../../services/BcryptService";
import { JwtService } from "@/src/application/services/JwtService";
import { JsonWebTokenService } from "../../services/JsonWebTokenService";
import { PrismaLoginRepository } from "../../repositories/PrismaLoginRepository";
import { RefreshTokenRepository } from "@/src/domain/repositories/RefreshTokenRepository";
import { PrismaRefreshTokenRepository } from "../../repositories/PrismaRefreshTokenRepository";
import { IdService } from "@/src/application/services/IdService";
import { UuidService } from "../../services/UuidService";

export class LoginController {
    loginRepository: LoginRepository = new PrismaLoginRepository();
    refreshTokenRepository: RefreshTokenRepository =
        new PrismaRefreshTokenRepository();
    idService: IdService = new UuidService();
    cryptService: CryptService = new BcryptService();
    jwtService: JwtService = new JsonWebTokenService();

    localLoginUseCase: LocalLoginUseCase = new LocalLoginUseCase(
        this.loginRepository,
        this.refreshTokenRepository,
        this.idService,
        this.cryptService,
        this.jwtService,
    );

    async handle(email: string, password: string) {
        return this.localLoginUseCase.execute({ email, password });
    }
}
