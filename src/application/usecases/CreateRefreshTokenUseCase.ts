import RefreshTokenRepository from "@/src/domain/repositories/RefreshTokenRepository";

export default class CreateRefreshTokenUseCase {
    refreshTokenRepository: RefreshTokenRepository;

    constructor(refreshTokenRepository: RefreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    async execute(userId: string, expiresIn: Date) {
        const refreshToken =
            await this.refreshTokenRepository.getRefreshTokenByUserId(userId);

        if (refreshToken) {
            if (refreshToken.expiresIn < new Date(Date.now())) {
                await this.refreshTokenRepository.deleteRefreshToken(
                    refreshToken.id,
                );
            }
            return refreshToken.id;
        }

        return await this.refreshTokenRepository.createRefreshToken(
            userId,
            expiresIn,
        );
    }
}
