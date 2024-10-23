import RefreshTokenRepository from "@/src/domain/repositories/RefreshTokenRepository";
import UserRepository from "@/src/domain/repositories/UserRepository";
import JwtService from "../services/JwtService";
import CreateRefreshTokenUseCase from "./CreateRefreshTokenUseCase";

export default class GetAccessTokenUseCase {
    refreshTokenRepository: RefreshTokenRepository;
    userRepository: UserRepository;
    jwtService: JwtService;
    createRefreshTokenUseCase: CreateRefreshTokenUseCase;

    constructor(
        refreshTokenRepository: RefreshTokenRepository,
        userRepository: UserRepository,
        jwtService: JwtService,
        createRefreshTokenUseCase: CreateRefreshTokenUseCase,
    ) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.createRefreshTokenUseCase = createRefreshTokenUseCase;
    }

    async execute(refreshTokenId: string) {
        const refreshToken =
            await this.refreshTokenRepository.getRefreshTokenById(
                refreshTokenId,
            );
        if (refreshToken) {
            if (refreshToken.expiresIn < new Date(Date.now()))
                throw new Error("Refresh token is expired.");
            const user = await this.userRepository.getUserById(
                refreshToken.user.id,
            );
            if (!user) throw new Error("User not found.");
            await this.refreshTokenRepository.deleteRefreshToken(
                refreshToken.id,
            );
            return {
                access_token: await this.jwtService.sign(
                    { sub: user.id, email: user.email },
                    "std-auth-api-key",
                    { expiresIn: "30m" },
                ),
                refresh_token: await this.createRefreshTokenUseCase.execute(
                    user.id,
                    new Date(new Date().setHours(new Date().getHours() + 2)),
                ),
            };
        }
        throw new Error("Refresh token not found.");
    }
}
