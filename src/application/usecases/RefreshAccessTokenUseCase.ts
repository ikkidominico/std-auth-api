import { RefreshTokenRepository } from "@/src/domain/repositories/RefreshTokenRepository";
import { UserRepository } from "@/src/domain/repositories/UserRepository";
import { JwtService } from "../services/JwtService";
import { IdService } from "../services/IdService";

export class RefreshAccessTokenUseCase {
    refreshTokenRepository: RefreshTokenRepository;
    userRepository: UserRepository;
    idService: IdService;
    jwtService: JwtService;

    constructor(
        refreshTokenRepository: RefreshTokenRepository,
        userRepository: UserRepository,
        idService: IdService,
        jwtService: JwtService,
    ) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
        this.idService = idService;
        this.jwtService = jwtService;
    }

    async execute(refreshTokenId: string) {
        const refreshToken =
            await this.refreshTokenRepository.getRefreshTokenById(
                refreshTokenId,
            );

        if (!refreshToken) throw new Error("Refresh token not found.");

        if (refreshToken.expiresIn < new Date(Date.now()))
            throw new Error("Refresh token is expired.");

        const user = await this.userRepository.getUserById(
            refreshToken.user.id,
        );

        if (!user) throw new Error("User not found.");

        const access_token = await this.jwtService.sign(
            { sub: user.id, email: user.email },
            process.env.JWT_KEY as string,
            { expiresIn: "30m" },
        );

        const refreshTokenUpdateResult =
            await this.refreshTokenRepository.updateRefreshTokenByUserId(
                this.idService.getUuid(),
                user.id,
                new Date(new Date().setHours(new Date().getHours() + 2)),
            );

        if (!refreshTokenUpdateResult)
            throw new Error("Refresh token not updated.");

        const refresh_token = refreshTokenUpdateResult.id;

        return {
            access_token,
            refresh_token,
        };
    }
}
