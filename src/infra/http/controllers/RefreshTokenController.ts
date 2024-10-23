import GetAccessTokenUseCase from "@/src/application/usecases/GetAccessTokenUseCase";
import RefreshTokenRepository from "@/src/domain/repositories/RefreshTokenRepository";
import PrismaRefreshTokenRepository from "../../repositories/PrismaRefreshTokenRepository";
import UserRepository from "@/src/domain/repositories/UserRepository";
import PrismaUserRepository from "../../repositories/PrismaUserRepository";
import JwtService from "@/src/application/services/JwtService";
import JsonWebTokenService from "../../services/JsonWebTokenService";
import CreateRefreshTokenUseCase from "@/src/application/usecases/CreateRefreshTokenUseCase";

export default class RefreshTokenController {
    refreshTokenRepository: RefreshTokenRepository =
        new PrismaRefreshTokenRepository();
    userRepository: UserRepository = new PrismaUserRepository();
    jwtService: JwtService = new JsonWebTokenService();
    createRefreshTokenUseCase: CreateRefreshTokenUseCase =
        new CreateRefreshTokenUseCase(this.refreshTokenRepository);

    getAccessTokenUseCase: GetAccessTokenUseCase = new GetAccessTokenUseCase(
        this.refreshTokenRepository,
        this.userRepository,
        this.jwtService,
        this.createRefreshTokenUseCase,
    );

    async getAccessToken(refreshToken: string) {
        return this.getAccessTokenUseCase.execute(refreshToken);
    }
}
