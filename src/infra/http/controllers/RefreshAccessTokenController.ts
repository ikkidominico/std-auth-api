import { RefreshTokenRepository } from "@/src/domain/repositories/RefreshTokenRepository";
import { PrismaRefreshTokenRepository } from "../../repositories/PrismaRefreshTokenRepository";
import { UserRepository } from "@/src/domain/repositories/UserRepository";
import { PrismaUserRepository } from "../../repositories/PrismaUserRepository";
import { JwtService } from "@/src/application/services/JwtService";
import { JsonWebTokenService } from "../../services/JsonWebTokenService";
import { RefreshAccessTokenUseCase } from "@/src/application/usecases/RefreshAccessTokenUseCase";
import { IdService } from "@/src/application/services/IdService";
import { UuidService } from "../../services/UuidService";

export class RefreshAccessTokenController {
    refreshTokenRepository: RefreshTokenRepository =
        new PrismaRefreshTokenRepository();
    userRepository: UserRepository = new PrismaUserRepository();
    idService: IdService = new UuidService();
    jwtService: JwtService = new JsonWebTokenService();

    refreshAccessTokenUseCase: RefreshAccessTokenUseCase =
        new RefreshAccessTokenUseCase(
            this.refreshTokenRepository,
            this.userRepository,
            this.idService,
            this.jwtService,
        );

    async handle(refreshToken: string) {
        return this.refreshAccessTokenUseCase.execute(refreshToken);
    }
}
